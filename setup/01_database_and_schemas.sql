-- ============================================================
-- 01: Database, Schemas, Stage, File Format
-- OPS Data Marketplace Demo — RFS-SPDP-2026-06
-- ============================================================
-- Run as: ACCOUNTADMIN
-- Idempotent: safe to re-run

USE ROLE ACCOUNTADMIN;

CREATE OR REPLACE DATABASE ON_GOVERNANCE_RFS
  COMMENT = 'Ontario Public Service Data Marketplace — RFS-SPDP-2026-06 Demo';

-- Ministry schemas
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.MCCSS
  COMMENT = 'Ministry of Children, Community and Social Services';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.FIN
  COMMENT = 'Ministry of Finance';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.MOH
  COMMENT = 'Ministry of Health';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.EDU
  COMMENT = 'Ministry of Education';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.MTO
  COMMENT = 'Ministry of Transportation';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.ENERGY
  COMMENT = 'Ministry of Energy';
CREATE SCHEMA IF NOT EXISTS ON_GOVERNANCE_RFS.LABOUR
  COMMENT = 'Ministry of Labour, Immigration, Training and Skills Development';

-- Stage for CSV loading
CREATE STAGE IF NOT EXISTS ON_GOVERNANCE_RFS.PUBLIC.DATA_STAGE
  COMMENT = 'Staging area for sample data CSVs';

-- CSV file format
CREATE OR REPLACE FILE FORMAT ON_GOVERNANCE_RFS.PUBLIC.CSV_FORMAT
  TYPE = 'CSV'
  FIELD_OPTIONALLY_ENCLOSED_BY = '"'
  SKIP_HEADER = 1
  NULL_IF = ('', 'NULL', 'null')
  TRIM_SPACE = TRUE;

-- Warehouse (use existing or create)
CREATE WAREHOUSE IF NOT EXISTS COMPUTE_WH
  WAREHOUSE_SIZE = 'XSMALL'
  AUTO_SUSPEND = 60
  AUTO_RESUME = TRUE;

USE WAREHOUSE COMPUTE_WH;
