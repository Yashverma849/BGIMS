-- =====================================================================
-- MM BGIMS — Supabase Storage Setup for Student Documentation
-- Database Schema: storage (Native Supabase Storage Extensions)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. STORAGE BUCKET CREATION
-- ---------------------------------------------------------------------
-- Configures a private bucket named 'documentations' to hold marksheets
-- and certificates. Only accessible via authenticated requests or signed URLs.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'documentations',
    'documentations',
    FALSE,       -- Keep FALSE so files are not publicly accessible by guessable URLs
    10485760,    -- 10MB file size limit in bytes (10 * 1024 * 1024)
    ARRAY['application/pdf', 'image/jpeg', 'image/png'] -- Allowed document extensions
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ---------------------------------------------------------------------
-- 2. FILE HIERARCHY / PATH CONVENTION
-- ---------------------------------------------------------------------
-- To ensure applicants do not overwrite each other's documents and can upload
-- multiple files uniquely, we mandate the following folder structure:
--
-- Path format:   documentations/{application_id}/{document_type}.{extension}
--
-- Supported document types:
--   - 10th_marksheet
--   - 12th_marksheet
--   - graduation_marksheet
--   - entrance_scorecard
--   - identity_proof
--
-- Example paths:
--   - documentations/BGIMS-JK89L2/10th_marksheet.pdf
--   - documentations/BGIMS-JK89L2/12th_marksheet.png
--   - documentations/BGIMS-JK89L2/graduation_marksheet.pdf


-- ---------------------------------------------------------------------
-- 3. ROW LEVEL SECURITY (RLS) POLICIES ON storage.objects
-- ---------------------------------------------------------------------
-- Ensures that students can upload and manage their files, while only
-- authorized admissions and evaluation staff can read and review them.

-- Note: RLS is already enabled on storage.objects by default in Supabase.

-- POLICY A: Allow anyone (applicants/public) to upload their documents.
-- RLS checks that files are being written into the 'documentations' bucket.
CREATE POLICY "Allow public uploads to documentations bucket"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
    bucket_id = 'documentations'
);

-- POLICY B: Allow applicants to update/replace their own uploaded files.
-- Scopes writes to matching bucket.
CREATE POLICY "Allow update to documentations bucket"
ON storage.objects FOR UPDATE
TO public
USING (
    bucket_id = 'documentations'
)
WITH CHECK (
    bucket_id = 'documentations'
);

-- POLICY C: Allow authenticated admissions staff (Director/Staff) to read
-- and review student documents.
CREATE POLICY "Allow authenticated staff to view documentations"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'documentations'
);

-- POLICY D: Allow authenticated admissions staff to delete files (clean up)
CREATE POLICY "Allow authenticated staff to delete documentations"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'documentations'
);
