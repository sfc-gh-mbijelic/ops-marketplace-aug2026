-- ============================================================
-- 04: Tags and Masking Policies (Policy-as-Code)
-- ============================================================
USE DATABASE ON_GOVERNANCE_RFS;
USE SCHEMA PUBLIC;

-- ============================================================
-- TAGS
-- ============================================================

-- Certification tiers (per RFP: Draft, Certified, Authoritative)
CREATE OR REPLACE TAG CERTIFICATION
  ALLOWED_VALUES 'Draft', 'Certified', 'Authoritative'
  COMMENT = 'Data product certification level per OPS Data Governance Framework';

-- Sensitivity classification (drives masking policy propagation)
CREATE OR REPLACE TAG SENSITIVITY
  ALLOWED_VALUES 'PUBLIC', 'INTERNAL', 'RESTRICTED'
  COMMENT = 'Data sensitivity classification — determines access policy and masking';

-- AI/ML readiness indicators
CREATE OR REPLACE TAG AI_READY
  ALLOWED_VALUES 'TRUE', 'FALSE'
  COMMENT = 'Whether dataset has been validated for AI/ML use cases';

CREATE OR REPLACE TAG ML_ENABLED
  ALLOWED_VALUES 'TRUE', 'FALSE'
  COMMENT = 'Whether dataset includes ML-specific metadata (features, importance, quality)';

-- Ownership
CREATE OR REPLACE TAG DATA_OWNER
  COMMENT = 'Name of the designated Data Owner responsible for this asset';

CREATE OR REPLACE TAG DATA_STEWARD
  COMMENT = 'Name of the Data Steward responsible for quality and governance';

-- Delivery options
CREATE OR REPLACE TAG DELIVERY_METHOD
  ALLOWED_VALUES 'TABLE', 'VIEW', 'API', 'FEATURE_TABLE'
  COMMENT = 'Supported delivery methods for this data product';

-- Quality status (updated by DMF alerts)
CREATE OR REPLACE TAG QUALITY_STATUS
  ALLOWED_VALUES 'HEALTHY', 'WARNING', 'CRITICAL', 'UNDER_REVIEW'
  COMMENT = 'Current data quality status based on DMF monitoring';

-- Domain tag for filtering
CREATE OR REPLACE TAG DOMAIN
  ALLOWED_VALUES 'MCCSS', 'FIN', 'MOH', 'EDU', 'MTO', 'ENERGY', 'LABOUR'
  COMMENT = 'Ministry domain that owns this data product';

-- ============================================================
-- TAG-BASED MASKING POLICIES (Policy-as-Code)
-- ============================================================
-- These policies attach to the SENSITIVITY tag, not individual columns.
-- When SENSITIVITY = 'RESTRICTED' is set on a column, masking auto-applies.
-- This is the key differentiator: one policy, unlimited columns.

-- VARCHAR masking
CREATE OR REPLACE MASKING POLICY MASK_RESTRICTED_VARCHAR AS (val VARCHAR)
RETURNS VARCHAR ->
  CASE
    WHEN SYSTEM$GET_TAG_ON_CURRENT_COLUMN('ON_GOVERNANCE_RFS.PUBLIC.SENSITIVITY') = 'RESTRICTED'
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_ANALYST')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_OWNER')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_STEWARD')
      AND NOT IS_ROLE_IN_SESSION('ACCOUNTADMIN')
    THEN '***MASKED***'
    ELSE val
  END;

-- NUMBER masking
CREATE OR REPLACE MASKING POLICY MASK_RESTRICTED_NUMBER AS (val NUMBER)
RETURNS NUMBER ->
  CASE
    WHEN SYSTEM$GET_TAG_ON_CURRENT_COLUMN('ON_GOVERNANCE_RFS.PUBLIC.SENSITIVITY') = 'RESTRICTED'
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_ANALYST')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_OWNER')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_STEWARD')
      AND NOT IS_ROLE_IN_SESSION('ACCOUNTADMIN')
    THEN -999
    ELSE val
  END;

-- FLOAT masking
CREATE OR REPLACE MASKING POLICY MASK_RESTRICTED_FLOAT AS (val FLOAT)
RETURNS FLOAT ->
  CASE
    WHEN SYSTEM$GET_TAG_ON_CURRENT_COLUMN('ON_GOVERNANCE_RFS.PUBLIC.SENSITIVITY') = 'RESTRICTED'
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_ANALYST')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_OWNER')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_STEWARD')
      AND NOT IS_ROLE_IN_SESSION('ACCOUNTADMIN')
    THEN -999.0
    ELSE val
  END;

-- DATE masking
CREATE OR REPLACE MASKING POLICY MASK_RESTRICTED_DATE AS (val DATE)
RETURNS DATE ->
  CASE
    WHEN SYSTEM$GET_TAG_ON_CURRENT_COLUMN('ON_GOVERNANCE_RFS.PUBLIC.SENSITIVITY') = 'RESTRICTED'
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_ANALYST')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_OWNER')
      AND NOT IS_ROLE_IN_SESSION('OPS_DATA_STEWARD')
      AND NOT IS_ROLE_IN_SESSION('ACCOUNTADMIN')
    THEN '1900-01-01'::DATE
    ELSE val
  END;

-- ============================================================
-- ATTACH MASKING POLICIES TO TAGS (the magic)
-- ============================================================
-- This is policy-as-code: any column that gets SENSITIVITY tag
-- automatically inherits the masking policy. No per-column setup.

ALTER TAG ON_GOVERNANCE_RFS.PUBLIC.SENSITIVITY
  SET MASKING POLICY MASK_RESTRICTED_VARCHAR;

-- Note: Tag-based masking with multiple data types requires
-- the masking policy to handle the primary type. For columns
-- with NUMBER/FLOAT/DATE types that need masking, we apply
-- policies directly in script 05.

-- ============================================================
-- ACCESS REQUESTS TABLE
-- ============================================================
CREATE OR REPLACE TABLE PUBLIC.ACCESS_REQUESTS (
    REQUEST_ID VARCHAR DEFAULT UUID_STRING(),
    REQUESTOR_ROLE VARCHAR NOT NULL,
    REQUESTOR_NAME VARCHAR NOT NULL,
    TARGET_TABLE VARCHAR NOT NULL,
    PURPOSE VARCHAR NOT NULL,
    SENSITIVITY_LEVEL VARCHAR,
    STATUS VARCHAR DEFAULT 'PENDING',
    APPROVED_BY VARCHAR,
    REQUESTED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    RESOLVED_AT TIMESTAMP_NTZ,
    POLICY_EVALUATION VARCHAR,
    NOTIFICATION_SENT BOOLEAN DEFAULT FALSE
) COMMENT = 'Access request queue for restricted data products';

-- ============================================================
-- CLASSIFICATION AUDIT TABLE
-- ============================================================
CREATE OR REPLACE TABLE PUBLIC.CLASSIFICATION_AUDIT (
    AUDIT_ID VARCHAR DEFAULT UUID_STRING(),
    TABLE_NAME VARCHAR NOT NULL,
    COLUMN_NAME VARCHAR NOT NULL,
    AI_CATEGORY VARCHAR,
    AI_CONFIDENCE FLOAT,
    STEWARD_OVERRIDE VARCHAR,
    OVERRIDE_REASON VARCHAR,
    CLASSIFIED_BY VARCHAR DEFAULT CURRENT_USER(),
    CLASSIFIED_AT TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),
    STATUS VARCHAR DEFAULT 'ACCEPTED'
) COMMENT = 'Audit trail for AI classification decisions and steward overrides';

-- ============================================================
-- BUSINESS GLOSSARY TABLE (for Cortex Search corpus)
-- ============================================================
CREATE OR REPLACE TABLE PUBLIC.BUSINESS_GLOSSARY (
    GLOSSARY_ID NUMBER AUTOINCREMENT,
    SCHEMA_NAME VARCHAR,
    TABLE_NAME VARCHAR,
    COLUMN_NAME VARCHAR,
    BUSINESS_DEFINITION VARCHAR,
    DATA_TYPE VARCHAR,
    DOMAIN VARCHAR,
    CERTIFICATION VARCHAR,
    SENSITIVITY VARCHAR,
    AI_READY VARCHAR,
    DATA_OWNER VARCHAR,
    DATA_STEWARD VARCHAR,
    TAGS VARCHAR,
    TABLE_DESCRIPTION VARCHAR
) COMMENT = 'Enterprise business glossary — corpus for Cortex Search semantic search';
