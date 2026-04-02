// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiGateway from '../gateways/Api.gateway';
import SessionGateway from '../gateways/Session.gateway';

interface IContext {
  currencyCodeList: string[];
  setSelectedCurrency(currency: string): void;
  selectedCurrency: string;
}

export const Context = createContext<IContext>({
  currencyCodeList: [],
  selectedCurrency: 'USD',
  setSelectedCurrency: () => ({}),
});

interface IProps {
  children: React.ReactNode;
}

export const useCurrency = () => useContext(Context);

const CurrencyProvider = ({ children }: IProps) => {
  const { data: currencyCodeListUnsorted = [] } = useQuery({
    queryKey: ['currency'],
    queryFn: ApiGateway.getSupportedCurrencyList
  });
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  useEffect(() => {
    setSelectedCurrency(SessionGateway.getSession().currencyCode);
  }, []);

  const onSelectCurrency = useCallback((currency: string) => {
    setSelectedCurrency(currency);
    SessionGateway.setSessionValue('currencyCode', currency);
  }, []);

  const currencyCodeList = useMemo(
    () => [...currencyCodeListUnsorted].sort(),
    [currencyCodeListUnsorted]
  );

  const value = useMemo(
      () => ({
        currencyCodeList,
        selectedCurrency,
        setSelectedCurrency: onSelectCurrency,
      }),
      [currencyCodeList, selectedCurrency, onSelectCurrency]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default CurrencyProvider;
