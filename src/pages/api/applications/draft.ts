import type { APIRoute } from 'astro';
import { supabaseFetch } from '~lib/db/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const json = await request.json();
    const { step, applicationId, data } = json;

    if (!step || !applicationId || !data) {
      return new Response(JSON.stringify({ error: 'Missing step, applicationId, or data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (step === 1) {
      // Upsert to personal table
      await supabaseFetch('/personal', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          id: applicationId,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          gender: data.gender,
          address: data.address,
          city: data.city,
          state: data.state,
          pin: data.pin,
        }),
      });
    } else if (step === 2) {
      // Upsert to academic table
      await supabaseFetch('/academic', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          application_id: applicationId,
          x_board: data.x_board,
          x_year: Number(data.x_year),
          x_score: data.x_score,
          xii_board: data.xii_board,
          xii_year: Number(data.xii_year),
          xii_score: data.xii_score,
          ug_university: data.ug_university || null,
          ug_programme: data.ug_programme || null,
          ug_score: data.ug_score || null,
          entrance_test: data.entrance_test || null,
          entrance_year: data.entrance_year ? Number(data.entrance_year) : null,
          entrance_score: data.entrance_score || null,
        }),
      });
    } else if (step === 3) {
      // Upsert to programme table
      await supabaseFetch('/programme', {
        method: 'POST',
        headers: { 'Prefer': 'resolution=merge-duplicates' },
        body: JSON.stringify({
          application_id: applicationId,
          programme_id: data.programme_id,
          sop: data.sop || null,
          status: data.status || 'draft',
          submitted_at: new Date().toISOString(),
        }),
      });
    } else if (step === 4) {
      // Step 4 updates references and registers documents
      // 1. Update referee in programme
      await supabaseFetch(`/programme?application_id=eq.${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ref_name: data.ref_name || null,
          ref_email: data.ref_email || null,
          updated_at: new Date().toISOString(),
        }),
      });

      // 2. Register uploaded documents in document table
      if (data.documents) {
        for (const [docType, filePath] of Object.entries(data.documents)) {
          if (filePath) {
            await supabaseFetch('/document', {
              method: 'POST',
              headers: { 'Prefer': 'resolution=merge-duplicates' },
              body: JSON.stringify({
                application_id: applicationId,
                document_type: docType,
                file_path: filePath,
              }),
            });
          }
        }
      }
    } else if (step === 5) {
      // Step 5: Save final payment and set submitted status
      // 1. Insert transaction details
      if (data.paymentId) {
        await supabaseFetch('/payments', {
          method: 'POST',
          headers: { 'Prefer': 'resolution=merge-duplicates' },
          body: JSON.stringify({
            id: data.paymentId,
            application_id: applicationId,
            amount: data.amount,
            method: data.method,
            captured_at: new Date(data.capturedAt).toISOString(),
          }),
        });
      }

      // 2. Promote status to submitted
      await supabaseFetch(`/programme?application_id=eq.${applicationId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'submitted',
          updated_at: new Date().toISOString(),
        }),
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API draft save error:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
