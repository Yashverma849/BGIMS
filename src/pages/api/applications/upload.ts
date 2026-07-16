import type { APIRoute } from 'astro';
import { supabaseFetch } from '~lib/db/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const applicationId = formData.get('applicationId') as string | null;
    const docName = formData.get('docName') as string | null;

    if (!file || !applicationId || !docName) {
      return new Response(JSON.stringify({ error: 'Missing file, applicationId, or docName' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const ext = file.name.split('.').pop() || 'pdf';
    const path = `${applicationId}/${docName}.${ext}`;
    const { supabaseUrl, supabaseServiceKey } = await import('~lib/db/supabase');
    const fullUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/documentations/${path}`;

    const headers = {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': file.type,
    };

    try {
      const res = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: fileBuffer,
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 409 || res.status === 400) {
          const putRes = await fetch(fullUrl, {
            method: 'PUT',
            headers,
            body: fileBuffer,
          });
          if (!putRes.ok) {
            throw new Error(`Upload failed: ${await putRes.text()}`);
          }
        } else {
          throw new Error(`Upload failed (${res.status}): ${errText}`);
        }
      }
    } catch (err: any) {
      throw err;
    }

    return new Response(JSON.stringify({ success: true, path }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API file upload error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
