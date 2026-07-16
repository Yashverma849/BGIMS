/**
 * Supabase HTTP REST API client.
 *
 * Lightweight wrapper around the Supabase POSTGREST interface. Avoids heavy
 * dependencies, compile delays, or client/server bundle size issues.
 */

const url = (import.meta.env.DATABASE_URL || process.env.DATABASE_URL || '').trim();
const serviceKey = (
  import.meta.env.DATABASE_SERVICE_ROLE_KEY ||
  process.env.DATABASE_SERVICE_ROLE_KEY ||
  import.meta.env.DATABASE_ANON_KEY ||
  process.env.DATABASE_ANON_KEY ||
  ''
).trim();

export const supabaseUrl = url;
export const supabaseServiceKey = serviceKey;

export const isSupabase = url.startsWith('https://');

export async function supabaseFetch(path: string, options: RequestInit = {}): Promise<Response> {
  if (!url) {
    throw new Error('Supabase client: DATABASE_URL is not set in environment.');
  }

  const headers = {
    'apikey': serviceKey,
    'Authorization': `Bearer ${serviceKey}`,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const fullUrl = `${url.replace(/\/$/, '')}/rest/v1${path}`;
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(
      `Supabase API error (${response.status} ${response.statusText}): ${errorText || 'No detail provided'}`
    );
  }

  return response;
}
