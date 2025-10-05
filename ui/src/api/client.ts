import createClient from 'openapi-fetch';

import type { paths } from './schema';

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8080';
export const client = createClient<paths>({
  baseUrl,
  headers: {},
});