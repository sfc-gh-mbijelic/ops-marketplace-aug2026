-- ============================================================
-- 03: Load Data from CSVs (INSERT-based for portability)
-- ============================================================
-- Two options:
--   Option A: Stage-based (fast, requires PUT from local machine)
--   Option B: INSERT statements (slower, fully portable via Snowsight)
--
-- This script uses Option A. If you cannot PUT files, use the CSVs
-- with Snowsight's "Load Data" UI or run generate_inserts.py.
-- ============================================================

USE DATABASE ON_GOVERNANCE_RFS;
USE WAREHOUSE COMPUTE_WH;

-- ============================================================
-- OPTION A: Stage-based loading
-- First, PUT files to stage from your local machine:
--   PUT file:///path/to/ops-marketplace-aug2026/data/mccss_client_retention.csv @PUBLIC.DATA_STAGE/mccss/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/mccss_customer_demographics.csv @PUBLIC.DATA_STAGE/mccss/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/fin_revenue_transactions.csv @PUBLIC.DATA_STAGE/fin/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/moh_er_wait_times.csv @PUBLIC.DATA_STAGE/moh/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/moh_patient_outcome_features.csv @PUBLIC.DATA_STAGE/moh/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/edu_student_achievement.csv @PUBLIC.DATA_STAGE/edu/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/mto_road_infrastructure.csv @PUBLIC.DATA_STAGE/mto/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/energy_grid_telemetry.csv @PUBLIC.DATA_STAGE/energy/;
--   PUT file:///path/to/ops-marketplace-aug2026/data/labour_workforce_features.csv @PUBLIC.DATA_STAGE/labour/;
-- ============================================================

COPY INTO MCCSS.CLIENT_RETENTION_METRICS
FROM @PUBLIC.DATA_STAGE/mccss/mccss_client_retention.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO MCCSS.CUSTOMER_DEMOGRAPHICS
FROM @PUBLIC.DATA_STAGE/mccss/mccss_customer_demographics.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS
FROM @PUBLIC.DATA_STAGE/fin/fin_revenue_transactions.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO MOH.ER_WAIT_TIME_ANALYTICS
FROM @PUBLIC.DATA_STAGE/moh/moh_er_wait_times.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO MOH.PATIENT_OUTCOME_FEATURES
FROM @PUBLIC.DATA_STAGE/moh/moh_patient_outcome_features.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO EDU.STUDENT_ACHIEVEMENT_INDICATORS
FROM @PUBLIC.DATA_STAGE/edu/edu_student_achievement.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO MTO.ROAD_INFRASTRUCTURE_METRICS
FROM @PUBLIC.DATA_STAGE/mto/mto_road_infrastructure.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO ENERGY.ENERGY_GRID_TELEMETRY
FROM @PUBLIC.DATA_STAGE/energy/energy_grid_telemetry.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

COPY INTO LABOUR.WORKFORCE_DEVELOPMENT_FEATURES
FROM @PUBLIC.DATA_STAGE/labour/labour_workforce_features.csv
FILE_FORMAT = PUBLIC.CSV_FORMAT
ON_ERROR = 'CONTINUE';

-- Verify row counts
SELECT 'MCCSS.CLIENT_RETENTION_METRICS' AS TBL, COUNT(*) AS ROWS FROM MCCSS.CLIENT_RETENTION_METRICS
UNION ALL SELECT 'MCCSS.CUSTOMER_DEMOGRAPHICS', COUNT(*) FROM MCCSS.CUSTOMER_DEMOGRAPHICS
UNION ALL SELECT 'FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS', COUNT(*) FROM FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS
UNION ALL SELECT 'MOH.ER_WAIT_TIME_ANALYTICS', COUNT(*) FROM MOH.ER_WAIT_TIME_ANALYTICS
UNION ALL SELECT 'MOH.PATIENT_OUTCOME_FEATURES', COUNT(*) FROM MOH.PATIENT_OUTCOME_FEATURES
UNION ALL SELECT 'EDU.STUDENT_ACHIEVEMENT_INDICATORS', COUNT(*) FROM EDU.STUDENT_ACHIEVEMENT_INDICATORS
UNION ALL SELECT 'MTO.ROAD_INFRASTRUCTURE_METRICS', COUNT(*) FROM MTO.ROAD_INFRASTRUCTURE_METRICS
UNION ALL SELECT 'ENERGY.ENERGY_GRID_TELEMETRY', COUNT(*) FROM ENERGY.ENERGY_GRID_TELEMETRY
UNION ALL SELECT 'LABOUR.WORKFORCE_DEVELOPMENT_FEATURES', COUNT(*) FROM LABOUR.WORKFORCE_DEVELOPMENT_FEATURES;
