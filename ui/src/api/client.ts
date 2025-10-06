import createClient from 'openapi-fetch';

import type { paths } from './schema';

export const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
export const client = createClient<paths>({
  baseUrl,
  headers: {},
});
