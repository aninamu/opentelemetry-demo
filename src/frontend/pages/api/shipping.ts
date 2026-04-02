// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

import type { NextApiRequest, NextApiResponse } from 'next';
import InstrumentationMiddleware from '../../utils/telemetry/InstrumentationMiddleware';
import ShippingGateway from '../../gateways/http/Shipping.gateway';
import { Address, CartItem, Empty, Money } from '../../protos/demo';
import CurrencyGateway from '../../gateways/rpc/Currency.gateway';

type TResponse = Money | Empty;

const handler = async ({ method, query }: NextApiRequest, res: NextApiResponse<TResponse>) => {
  switch (method) {
    case 'GET': {
      const { itemList = '', currencyCode = 'USD', address = '' } = query;
      let parsedItemList: CartItem[];
      let parsedAddress: Address;

      try {
        parsedItemList = JSON.parse(itemList as string) as CartItem[];
        parsedAddress = JSON.parse(address as string) as Address;
      } catch {
        return res.status(400).send('');
      }

      const { costUsd } = await ShippingGateway.getShippingCost(parsedItemList, parsedAddress);
      const cost = await CurrencyGateway.convert(costUsd!, currencyCode as string);

      return res.status(200).json(cost!);
    }

    default: {
      return res.status(405);
    }
  }
};

export default InstrumentationMiddleware(handler);
