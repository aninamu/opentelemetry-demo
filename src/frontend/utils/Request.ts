// Copyright The OpenTelemetry Authors
// SPDX-License-Identifier: Apache-2.0

interface IRequestParams {
  url: string;
  body?: object;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  queryParams?: Record<string, any>;
  headers?: Record<string, string>;
}

const request = async <T>({
  url = '',
  method = 'GET',
  body,
  queryParams = {},
  headers = {
    'content-type': 'application/json',
  },
}: IRequestParams): Promise<T> => {
  const queryString = new URLSearchParams(queryParams).toString();
  const requestUrl = queryString ? `${url}?${queryString}` : url;
  const response = await fetch(requestUrl, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });

  const responseText = await response.text();
  if (!response.ok) {
    throw new Error(
      `Request failed (${response.status} ${response.statusText}) for ${method} ${requestUrl}: ${responseText}`
    );
  }

  if (responseText) {
    try {
      return JSON.parse(responseText);
    } catch {
      throw new Error(`Invalid JSON response for ${method} ${requestUrl}`);
    }
  }

  return undefined as unknown as T;
};

export default request;
