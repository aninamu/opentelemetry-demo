// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

package main

//go:generate go install google.golang.org/protobuf/cmd/protoc-gen-go
//go:generate go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
//go:generate protoc --go_out=./ --go-grpc_out=./ --proto_path=../../pb ../../pb/demo.proto

import (
	"context"
	"fmt"
	"log/slog"
	"math"
	"math/rand"
	"net"
	"os"
	"os/signal"
	"runtime"
	"strings"
	"sync"
	"sync/atomic"
	"syscall"
	"time"

	"go.opentelemetry.io/contrib/bridges/otelslog"
	"go.opentelemetry.io/contrib/instrumentation/google.golang.org/grpc/otelgrpc"
	runtimemetrics "go.opentelemetry.io/contrib/instrumentation/runtime"
	"go.opentelemetry.io/contrib/otelconf"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/baggage"
	otelcodes "go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/log/global"
	"go.opentelemetry.io/otel/metric"
	"go.opentelemetry.io/otel/trace"

	otelhooks "github.com/open-feature/go-sdk-contrib/hooks/open-telemetry/pkg"
	flagd "github.com/open-feature/go-sdk-contrib/providers/flagd/pkg"
	"github.com/open-feature/go-sdk/openfeature"
	pb "github.com/opentelemetry/opentelemetry-demo/src/ad/genproto/oteldemo"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/health"
	healthpb "google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/reflection"
	"google.golang.org/grpc/status"
)

const (
	maxAdsToServe = 2

	featureFlagAdFailure  = "adFailure"
	featureFlagAdManualGc = "adManualGc"
	featureFlagAdHighCpu  = "adHighCpu"
)

type adRequestType string
type adResponseType string

const (
	adRequestTypeTargeted    adRequestType  = "TARGETED"
	adRequestTypeNotTargeted adRequestType  = "NOT_TARGETED"
	adResponseTypeTargeted   adResponseType = "TARGETED"
	adResponseTypeRandom     adResponseType = "RANDOM"
)

var (
	logger *slog.Logger
	tracer trace.Tracer
	meter  metric.Meter

	adRequestsCounter metric.Int64Counter

	adsMap = createAdsMap()

	cpuLoadManager = newCPULoadManager()
	gcTrigger      = newGCTrigger()
)

type adService struct {
	pb.UnimplementedAdServiceServer
	ffClient openfeature.Client
}

func init() {
	logger = otelslog.NewLogger("ad")
}

func main() {
	ctx := context.Background()

	sdk, err := otelconf.NewSDK(otelconf.WithContext(ctx))
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to initialize OpenTelemetry SDK: %v", err))
		os.Exit(1)
	}
	defer func() {
		if err := sdk.Shutdown(ctx); err != nil {
			logger.Error(fmt.Sprintf("Error shutting down OpenTelemetry SDK: %v", err))
		}
		logger.Info("Shutdown OpenTelemetry SDK")
	}()

	otel.SetTracerProvider(sdk.TracerProvider())
	otel.SetMeterProvider(sdk.MeterProvider())
	global.SetLoggerProvider(sdk.LoggerProvider())
	otel.SetTextMapPropagator(sdk.Propagator())

	tracer = otel.Tracer("ad")
	meter = otel.Meter("ad")

	adRequestsCounter, err = meter.Int64Counter(
		"app.ads.ad_requests",
		metric.WithDescription("Counts ad requests by request and response type"),
	)
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to create ad_requests counter: %v", err))
	}

	openfeature.AddHooks(otelhooks.NewTracesHook())
	provider, err := flagd.NewProvider()
	if err != nil {
		logger.Error(fmt.Sprintf("Error creating flagd provider: %v", err))
	}
	if err := openfeature.SetProvider(provider); err != nil {
		logger.Error(fmt.Sprintf("Error setting flagd provider: %v", err))
	}

	if err := runtimemetrics.Start(runtimemetrics.WithMinimumReadMemStatsInterval(time.Second)); err != nil {
		logger.Error(fmt.Sprintf("Error starting runtime metrics: %v", err))
	}

	var port string
	mustMapEnv(&port, "AD_PORT")

	svc := &adService{
		ffClient: *openfeature.NewClient("ad"),
	}

	ln, err := net.Listen("tcp", fmt.Sprintf(":%s", port))
	if err != nil {
		logger.Error(fmt.Sprintf("TCP Listen: %v", err))
		os.Exit(1)
	}

	srv := grpc.NewServer(
		grpc.StatsHandler(otelgrpc.NewServerHandler()),
	)

	reflection.Register(srv)
	pb.RegisterAdServiceServer(srv, svc)

	healthcheck := health.NewServer()
	healthpb.RegisterHealthServer(srv, healthcheck)

	logger.Info(fmt.Sprintf("Ad service started, listening on port %s", port))

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM, syscall.SIGKILL)
	defer cancel()

	go func() {
		if err := srv.Serve(ln); err != nil {
			logger.Error(fmt.Sprintf("Failed to serve gRPC server: %v", err))
		}
	}()

	<-ctx.Done()

	cpuLoadManager.stop()
	srv.GracefulStop()
	logger.Info("Ad service stopped")
}

func mustMapEnv(target *string, key string) {
	value, present := os.LookupEnv(key)
	if !present {
		logger.Error(fmt.Sprintf("Environment Variable Not Set: %q", key))
		os.Exit(1)
	}
	*target = value
}

func (a *adService) GetAds(ctx context.Context, req *pb.AdRequest) (*pb.AdResponse, error) {
	span := trace.SpanFromContext(ctx)

	bag := baggage.FromContext(ctx)
	sessionID := ""
	if member := bag.Member("session.id"); member.Key() != "" {
		sessionID = member.Value()
		span.SetAttributes(attribute.String("session.id", sessionID))
	} else {
		logger.Info("no baggage found in context")
	}

	evalCtx := openfeature.NewEvaluationContext(sessionID, map[string]interface{}{
		"session": sessionID,
	})

	highCpuEnabled, _ := a.ffClient.BooleanValue(ctx, featureFlagAdHighCpu, false, evalCtx)
	cpuLoadManager.execute(highCpuEnabled)

	span.SetAttributes(
		attribute.String("app.ads.contextKeys", strings.Join(req.GetContextKeys(), ",")),
		attribute.Int("app.ads.contextKeys.count", len(req.GetContextKeys())),
	)

	var allAds []*pb.Ad
	var reqType adRequestType
	var respType adResponseType

	if len(req.GetContextKeys()) > 0 {
		logger.Info(fmt.Sprintf("Targeted ad request received for %v", req.GetContextKeys()))
		for _, key := range req.GetContextKeys() {
			ads := getAdsByCategory(ctx, key)
			allAds = append(allAds, ads...)
		}
		reqType = adRequestTypeTargeted
		respType = adResponseTypeTargeted
	} else {
		logger.Info("Non-targeted ad request received, preparing random response.")
		allAds = getRandomAds(ctx)
		reqType = adRequestTypeNotTargeted
		respType = adResponseTypeRandom
	}

	if len(allAds) == 0 {
		allAds = getRandomAds(ctx)
		respType = adResponseTypeRandom
	}

	span.SetAttributes(
		attribute.Int("app.ads.count", len(allAds)),
		attribute.String("app.ads.ad_request_type", string(reqType)),
		attribute.String("app.ads.ad_response_type", string(respType)),
	)

	adRequestsCounter.Add(ctx, 1,
		metric.WithAttributes(
			attribute.String("app.ads.ad_request_type", string(reqType)),
			attribute.String("app.ads.ad_response_type", string(respType)),
		),
	)

	adFailureEnabled, _ := a.ffClient.BooleanValue(ctx, featureFlagAdFailure, false, evalCtx)
	if adFailureEnabled && rand.Intn(10) == 0 {
		span.AddEvent("Error", trace.WithAttributes(attribute.String("exception.message", "Ad failure feature flag enabled")))
		span.SetStatus(otelcodes.Error, "Ad failure triggered")
		logger.Warn("GetAds Failed with status UNAVAILABLE")
		return nil, status.Errorf(codes.Unavailable, "Ad service unavailable")
	}

	manualGcEnabled, _ := a.ffClient.BooleanValue(ctx, featureFlagAdManualGc, false, evalCtx)
	if manualGcEnabled {
		logger.Warn(fmt.Sprintf("Feature Flag %s enabled, performing a manual gc now", featureFlagAdManualGc))
		gcTrigger.execute()
	}

	return &pb.AdResponse{Ads: allAds}, nil
}

func getAdsByCategory(ctx context.Context, category string) []*pb.Ad {
	_, span := tracer.Start(ctx, "getAdsByCategory",
		trace.WithAttributes(attribute.String("app.ads.category", category)),
	)
	defer span.End()

	ads, ok := adsMap[category]
	if !ok {
		ads = []*pb.Ad{}
	}
	span.SetAttributes(attribute.Int("app.ads.count", len(ads)))
	return ads
}

func getRandomAds(ctx context.Context) []*pb.Ad {
	_, span := tracer.Start(ctx, "getRandomAds")
	defer span.End()

	var allAds []*pb.Ad
	for _, ads := range adsMap {
		allAds = append(allAds, ads...)
	}

	if len(allAds) == 0 {
		span.SetAttributes(attribute.Int("app.ads.count", 0))
		return []*pb.Ad{}
	}

	result := make([]*pb.Ad, 0, maxAdsToServe)
	for i := 0; i < maxAdsToServe && len(allAds) > 0; i++ {
		idx := rand.Intn(len(allAds))
		result = append(result, allAds[idx])
	}

	span.SetAttributes(attribute.Int("app.ads.count", len(result)))
	return result
}

func createAdsMap() map[string][]*pb.Ad {
	binoculars := &pb.Ad{
		RedirectUrl: "/product/2ZYFJ3GM2N",
		Text:        "Roof Binoculars for sale. 50% off.",
	}
	explorerTelescope := &pb.Ad{
		RedirectUrl: "/product/66VCHSJNUP",
		Text:        "Starsense Explorer Refractor Telescope for sale. 20% off.",
	}
	colorImager := &pb.Ad{
		RedirectUrl: "/product/0PUK6V6EV0",
		Text:        "Solar System Color Imager for sale. 30% off.",
	}
	opticalTube := &pb.Ad{
		RedirectUrl: "/product/9SIQT8TOJO",
		Text:        "Optical Tube Assembly for sale. 10% off.",
	}
	travelTelescope := &pb.Ad{
		RedirectUrl: "/product/1YMWWN1N4O",
		Text:        "Eclipsmart Travel Refractor Telescope for sale. Buy one, get second kit for free",
	}
	solarFilter := &pb.Ad{
		RedirectUrl: "/product/6E92ZMYYFZ",
		Text:        "Solar Filter for sale. Buy two, get third one for free",
	}
	cleaningKit := &pb.Ad{
		RedirectUrl: "/product/L9ECAV7KIM",
		Text:        "Lens Cleaning Kit for sale. Buy one, get second one for free",
	}

	return map[string][]*pb.Ad{
		"binoculars":  {binoculars},
		"telescopes":  {explorerTelescope},
		"accessories": {colorImager, solarFilter, cleaningKit},
		"assembly":    {opticalTube},
		"travel":      {travelTelescope},
	}
}

type cpuLoadManagerType struct {
	running  atomic.Bool
	mu       sync.Mutex
	stopChan chan struct{}
}

func newCPULoadManager() *cpuLoadManagerType {
	return &cpuLoadManagerType{}
}

func (c *cpuLoadManagerType) execute(enabled bool) {
	if enabled {
		if c.running.CompareAndSwap(false, true) {
			logger.Info("High CPU-Load problempattern enabled")
			c.mu.Lock()
			c.stopChan = make(chan struct{})
			c.mu.Unlock()
			c.spawnLoadWorkers(4)
		}
	} else {
		c.stop()
	}
}

func (c *cpuLoadManagerType) stop() {
	if c.running.CompareAndSwap(true, false) {
		c.mu.Lock()
		if c.stopChan != nil {
			close(c.stopChan)
		}
		c.mu.Unlock()
	}
}

func (c *cpuLoadManagerType) spawnLoadWorkers(count int) {
	c.mu.Lock()
	stopChan := c.stopChan
	c.mu.Unlock()

	for i := 0; i < count; i++ {
		go func() {
			for {
				select {
				case <-stopChan:
					return
				default:
					math.Log(float64(time.Now().UnixNano()))
				}
			}
		}()
	}
}

type gcTriggerType struct {
	lastGC  time.Time
	mu      sync.Mutex
	gcDelay time.Duration
}

func newGCTrigger() *gcTriggerType {
	return &gcTriggerType{
		gcDelay: 10 * time.Second,
	}
}

func (g *gcTriggerType) execute() {
	g.mu.Lock()
	defer g.mu.Unlock()

	if time.Since(g.lastGC) > g.gcDelay {
		logger.Info(fmt.Sprintf("Triggering a manual garbage collection, next one in %d seconds.", int(g.gcDelay.Seconds())))

		start := time.Now()
		runtime.GC()
		elapsed := time.Since(start)

		logger.Info(fmt.Sprintf("The artificially triggered GC took: %d ms", elapsed.Milliseconds()))
		g.lastGC = time.Now()
	}
}
