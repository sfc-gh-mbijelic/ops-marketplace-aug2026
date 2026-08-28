-- ============================================================
-- 10: Internal Marketplace — Org Listings
-- ============================================================
-- NOTE: Internal Marketplace requires:
-- 1. Provider Profile set up in Snowsight (Account Admin > Provider Studio)
-- 2. ORGADMIN or ACCOUNTADMIN role
--
-- MANUAL STEPS (do these in Snowsight before running this script):
-- 1. Go to Data Products > Provider Studio
-- 2. Click "Become a Provider"
-- 3. Fill in:
--    - Organization: Ontario Public Service
--    - Provider Name: OPS Enterprise Data Platform
--    - Description: Official data product catalog for Ontario Public Service ministries
-- 4. Save
--
-- If your account does not have org listing capability, the demo
-- still works fully via the SPCS React app + Streamlit console.
-- The Internal Marketplace is shown as the native "this is the product" layer.
-- ============================================================

USE ROLE ACCOUNTADMIN;
USE DATABASE ON_GOVERNANCE_RFS;

-- ============================================================
-- CREATE SHARES FOR LISTINGS
-- ============================================================
-- Each listing needs a share object. For org listings within the same
-- account, we use secure views as the listing content.

-- Secure views for marketplace consumption
CREATE OR REPLACE SECURE VIEW PUBLIC.V_CLIENT_RETENTION_METRICS AS
SELECT * FROM MCCSS.CLIENT_RETENTION_METRICS;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_CUSTOMER_DEMOGRAPHICS AS
SELECT * FROM MCCSS.CUSTOMER_DEMOGRAPHICS;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_REVENUE_TRANSACTIONS AS
SELECT * FROM FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_ER_WAIT_TIME_ANALYTICS AS
SELECT * FROM MOH.ER_WAIT_TIME_ANALYTICS;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_PATIENT_OUTCOME_FEATURES AS
SELECT * FROM MOH.PATIENT_OUTCOME_FEATURES;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_WORKFORCE_FEATURES AS
SELECT * FROM LABOUR.WORKFORCE_DEVELOPMENT_FEATURES;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_ROAD_INFRASTRUCTURE AS
SELECT * FROM MTO.ROAD_INFRASTRUCTURE_METRICS;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_ENERGY_GRID AS
SELECT * FROM ENERGY.ENERGY_GRID_TELEMETRY;

CREATE OR REPLACE SECURE VIEW PUBLIC.V_STUDENT_ACHIEVEMENT AS
SELECT * FROM EDU.STUDENT_ACHIEVEMENT_INDICATORS;

-- ============================================================
-- LISTING METADATA TABLE (for the React app to display)
-- ============================================================
-- This bridges the gap between Internal Marketplace (which has its own
-- metadata UI) and our React app (which needs structured data).

CREATE OR REPLACE TABLE PUBLIC.LISTING_METADATA (
  LISTING_ID VARCHAR DEFAULT UUID_STRING(),
  SCHEMA_NAME VARCHAR NOT NULL,
  TABLE_NAME VARCHAR NOT NULL,
  DISPLAY_NAME VARCHAR NOT NULL,
  DESCRIPTION VARCHAR,
  DOMAIN VARCHAR,
  CERTIFICATION VARCHAR,
  SENSITIVITY VARCHAR,
  AI_READY BOOLEAN DEFAULT FALSE,
  ML_ENABLED BOOLEAN DEFAULT FALSE,
  DATA_OWNER VARCHAR,
  DATA_STEWARD VARCHAR,
  DELIVERY_METHODS ARRAY,
  UPDATE_FREQUENCY VARCHAR DEFAULT 'Daily',
  ROW_COUNT NUMBER,
  QUALITY_SCORE NUMBER,
  WEEKLY_QUERIES NUMBER DEFAULT 0,
  UNIQUE_USERS NUMBER DEFAULT 0,
  TAGS ARRAY,
  PUBLISHED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
  STATUS VARCHAR DEFAULT 'PUBLISHED'
);

-- Populate listing metadata
INSERT INTO PUBLIC.LISTING_METADATA (SCHEMA_NAME, TABLE_NAME, DISPLAY_NAME, DESCRIPTION, DOMAIN, CERTIFICATION, SENSITIVITY, AI_READY, ML_ENABLED, DATA_OWNER, DATA_STEWARD, DELIVERY_METHODS, ROW_COUNT, QUALITY_SCORE, WEEKLY_QUERIES, UNIQUE_USERS, TAGS)
VALUES
('MCCSS', 'CLIENT_RETENTION_METRICS', 'Client Retention Metrics',
 'Client retention rates, satisfaction scores, and churn risk indicators across MCCSS service programs. Tracks engagement patterns and program effectiveness for policy planning.',
 'MCCSS', 'Authoritative', 'INTERNAL', TRUE, FALSE, 'Sarah Chen', 'Michael Torres',
 ARRAY_CONSTRUCT('TABLE', 'API'), 1000, 96, 142, 28,
 ARRAY_CONSTRUCT('retention', 'social-services', 'client-outcomes', 'program-effectiveness')),

('MCCSS', 'CUSTOMER_DEMOGRAPHICS', 'Customer Demographics',
 'Demographic profile of MCCSS program clients. Supports equity analysis, program targeting, and cross-ministry demographic research.',
 'MCCSS', 'Certified', 'RESTRICTED', TRUE, FALSE, 'Sarah Chen', 'Michael Torres',
 ARRAY_CONSTRUCT('TABLE', 'VIEW'), 1000, 94, 87, 19,
 ARRAY_CONSTRUCT('demographics', 'equity', 'social-services', 'population')),

('FIN', 'BUSINESS_ENTITY_REVENUE_TRANSACTIONS', 'Business Entity Revenue Transactions',
 'Business entity revenue transactions for Ontario tax administration. Contains confidential financial data subject to Taxpayer Confidentiality provisions.',
 'FIN', 'Authoritative', 'RESTRICTED', FALSE, FALSE, 'David Park', 'Angela Rossi',
 ARRAY_CONSTRUCT('VIEW'), 1000, 98, 56, 8,
 ARRAY_CONSTRUCT('finance', 'revenue', 'tax', 'business-entities')),

('MOH', 'ER_WAIT_TIME_ANALYTICS', 'ER Wait Time Analytics',
 'Emergency department visit analytics: wait times, triage, throughput, and outcomes. Source: MOHLTC Hospital Reporting System + CIHI Emergency Department data.',
 'MOH', 'Authoritative', 'INTERNAL', FALSE, FALSE, 'Dr. Rajesh Patel', 'Emily Watson',
 ARRAY_CONSTRUCT('TABLE', 'API'), 1000, 92, 180, 34,
 ARRAY_CONSTRUCT('healthcare', 'emergency', 'wait-times', 'hospitals')),

('MOH', 'PATIENT_OUTCOME_FEATURES', 'Patient Outcome Features',
 'Pre-engineered patient outcome prediction features. AI-Ready: validated for ML model training with quality scores, feature importance rankings, and freshness metadata.',
 'MOH', 'Authoritative', 'RESTRICTED', TRUE, TRUE, 'Dr. Rajesh Patel', 'Emily Watson',
 ARRAY_CONSTRUCT('FEATURE_TABLE', 'API'), 1000, 97, 64, 12,
 ARRAY_CONSTRUCT('ai-ready', 'ml-features', 'healthcare', 'outcomes-prediction')),

('EDU', 'STUDENT_ACHIEVEMENT_INDICATORS', 'Student Achievement Indicators',
 'Student achievement metrics across Ontario schools. Used for education policy analysis, equity assessment, and program effectiveness evaluation.',
 'EDU', 'Draft', 'INTERNAL', FALSE, FALSE, 'Jennifer Wu', 'Robert Okafor',
 ARRAY_CONSTRUCT('TABLE'), 1000, 78, 23, 6,
 ARRAY_CONSTRUCT('education', 'students', 'achievement', 'equity')),

('MTO', 'ROAD_INFRASTRUCTURE_METRICS', 'Road Infrastructure Metrics',
 'Road infrastructure condition, traffic, and maintenance metrics for Ontario provincial highways. Supports capital planning and safety analysis.',
 'MTO', 'Certified', 'PUBLIC', FALSE, FALSE, 'Mark Thompson', 'Lisa Nguyen',
 ARRAY_CONSTRUCT('TABLE', 'API'), 1000, 91, 45, 15,
 ARRAY_CONSTRUCT('infrastructure', 'roads', 'highways', 'transportation')),

('ENERGY', 'ENERGY_GRID_TELEMETRY', 'Energy Grid Telemetry',
 'Ontario electricity grid telemetry: generation output, demand, frequency, and stability metrics. Source: IESO real-time monitoring system.',
 'ENERGY', 'Certified', 'PUBLIC', TRUE, FALSE, 'Priya Sharma', 'James Liu',
 ARRAY_CONSTRUCT('TABLE', 'API', 'FEATURE_TABLE'), 1000, 95, 112, 22,
 ARRAY_CONSTRUCT('energy', 'grid', 'telemetry', 'sustainability')),

('LABOUR', 'WORKFORCE_DEVELOPMENT_FEATURES', 'Workforce Development Features',
 'Workforce development program features for employment outcome prediction. AI-Ready: validated for ML training with quality scores and feature importance.',
 'LABOUR', 'Certified', 'INTERNAL', TRUE, TRUE, 'Karen Fletcher', 'Ahmed Hassan',
 ARRAY_CONSTRUCT('FEATURE_TABLE', 'API'), 1000, 93, 38, 9,
 ARRAY_CONSTRUCT('ai-ready', 'ml-features', 'workforce', 'employment'));

-- ============================================================
-- INTERNAL MARKETPLACE LISTING CREATION
-- ============================================================
-- Uncomment and run if your account has Provider Studio enabled.
-- Otherwise, the demo uses the SPCS React app as the marketplace UI.

/*
-- Example listing creation (syntax may vary by account config):
CREATE LISTING OPS_CLIENT_RETENTION_METRICS
  FOR DATA EXCHANGE OPS_INTERNAL_EXCHANGE
  AS
  $$
  title: "Client Retention Metrics"
  description: "Client retention rates, satisfaction scores, and churn risk indicators"
  terms_of_service:
    type: "OFFLINE"
  targets:
    accounts: ["CURRENT_ORG"]
  auto_fulfillment:
    refresh_schedule: "10 MINUTE"
    refresh_type: "FULL_DATABASE"
  $$;

ALTER LISTING OPS_CLIENT_RETENTION_METRICS
  SET SHARED_DATABASE = ON_GOVERNANCE_RFS;
*/
