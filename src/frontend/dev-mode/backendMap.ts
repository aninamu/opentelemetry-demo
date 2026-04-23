// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

/**
 * Map frontend API path prefixes to backend service directories under `src/` in the monorepo.
 * Used to suggest "related" backend code when the page has made matching API calls.
 */
const API_PREFIX_TO_SERVICE: Array<{ prefix: string; service: string }> = [
  { prefix: '/api/cart', service: 'cart' },
  { prefix: '/api/checkout', service: 'checkout' },
  { prefix: '/api/currency', service: 'currency' },
  { prefix: '/api/shipping', service: 'shipping' },
  { prefix: '/api/products', service: 'product-catalog' },
  { prefix: '/api/product-reviews-avg-score', service: 'product-reviews' },
  { prefix: '/api/product-reviews', service: 'product-reviews' },
  { prefix: '/api/recommendations', service: 'recommendation' },
  { prefix: '/api/data', service: 'ad' },
  { prefix: '/api/product-ask-ai-assistant', service: 'llm' },
];

/** Heuristic: component name → likely backend for that UI area. */
const COMPONENT_NAME_TO_SERVICE: Record<string, string> = {
  ProductCard: 'product-catalog',
  ProductList: 'product-catalog',
  ProductPrice: 'product-catalog',
  Recommendations: 'recommendation',
  ProductReviews: 'product-reviews',
  Ad: 'ad',
  CartIcon: 'cart',
  CartItems: 'cart',
  CartDropdown: 'cart',
  CheckoutForm: 'checkout',
  CurrencySwitcher: 'currency',
  Banner: 'ad',
  Header: 'frontend', // this service
  Footer: 'frontend',
  Layout: 'frontend',
  Input: 'frontend',
  Button: 'frontend',
  Select: 'frontend',
};

export function serviceForApiPath(pathname: string): string | undefined {
  for (const { prefix, service } of API_PREFIX_TO_SERVICE) {
    if (pathname.startsWith(prefix) || pathname.includes(prefix)) {
      return service;
    }
  }
  return undefined;
}

export function serviceForComponentName(name: string): string | undefined {
  return COMPONENT_NAME_TO_SERVICE[name];
}

export { API_PREFIX_TO_SERVICE, COMPONENT_NAME_TO_SERVICE };
