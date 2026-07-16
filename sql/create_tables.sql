-- =====================================================================
-- MM BGIMS — Babasaheb Gawde Institute of Management Studies
-- Database Schema for Admissions (Apply) and Enquiries (Contact) Forms
-- Dialect: PostgreSQL (Native Syntax)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. APPLICATIONS TABLE (Apply/Admission Form)
-- ---------------------------------------------------------------------
-- Captures full multi-page student application details, payment records,
-- and state machine status. Uses short string IDs (e.g. BGIMS-XXXXXX).

CREATE TABLE IF NOT EXISTS applications (
    -- Unique application ID, generated as 'BGIMS-' followed by a base-36 timestamp suffix
    id VARCHAR(50) PRIMARY KEY,
    
    -- Programme code chosen by applicant: 'MBA-BF', 'MMS', 'BMS', 'PHD'
    programme VARCHAR(20) NOT NULL,
    
    -- Admission cycle state: 'submitted', 'shortlisted', 'interviewed', 'offered', 'rejected'
    status VARCHAR(30) DEFAULT 'submitted' NOT NULL,
    
    -- Primary applicant details (duplicated out of JSON payload for list indexing)
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    
    -- Payment integration record (fee amount tracked in smallest currency unit / paise)
    amount_in_paise INTEGER NOT NULL,
    pay_method VARCHAR(20) NOT NULL,       -- Payment gateway channel: 'upi', 'card', 'netbanking', 'wallet'
    payment_id VARCHAR(100) NOT NULL,      -- Gateway reference transaction ID (e.g. pay_xxxxxxxxxxxx)
    
    -- Full Application Schema JSON containing academic boards, scores, addresses, etc.
    -- PostgreSQL native JSONB format allows binary storage and fast indexing
    payload JSONB NOT NULL,
    
    -- Timestamps represented in standard PostgreSQL timestamptz (with timezone info)
    submitted_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexing for quick admissions desk filtering and cohort checks
CREATE INDEX IF NOT EXISTS apps_programme_idx ON applications (programme);
CREATE INDEX IF NOT EXISTS apps_status_idx ON applications (status);
CREATE INDEX IF NOT EXISTS apps_submitted_idx ON applications (submitted_at);
CREATE INDEX IF NOT EXISTS apps_email_idx ON applications (email);


-- ---------------------------------------------------------------------
-- 2. ENQUIRIES TABLE (Contact/General Inquiry Form)
-- ---------------------------------------------------------------------
-- Captures contact form submissions routed to the admissions cell.
-- Uses string IDs (e.g. ENQ-XXXXXX).

CREATE TABLE IF NOT EXISTS enquiries (
    -- Unique enquiry reference ID, generated as 'ENQ-' followed by a base-36 timestamp suffix
    id VARCHAR(50) PRIMARY KEY,
    
    -- Sender contact details
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30) DEFAULT '' NOT NULL,
    
    -- Topic / choice of interest (defaults to 'General enquiry')
    programme VARCHAR(100) DEFAULT 'General enquiry' NOT NULL,
    
    -- Message text content
    message TEXT NOT NULL,
    
    -- Explicit consent checkbox check: Boolean FALSE or TRUE
    consent BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Administrative triage status: 'new', 'contacted', 'closed'
    status VARCHAR(20) DEFAULT 'new' NOT NULL,
    
    -- Submission timestamp represented in standard PostgreSQL timestamptz
    received_at TIMESTAMPTZ NOT NULL
);

-- Indexing for admissions ticket triage and filtering
CREATE INDEX IF NOT EXISTS enq_received_idx ON enquiries (received_at);
CREATE INDEX IF NOT EXISTS enq_status_idx ON enquiries (status);
