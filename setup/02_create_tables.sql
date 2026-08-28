-- ============================================================
-- 02: Table DDL with Column Comments (Business Glossary)
-- ============================================================
USE DATABASE ON_GOVERNANCE_RFS;

-- ============================================================
-- MCCSS: Client Retention Metrics (Story 1 - Search Target)
-- ============================================================
CREATE OR REPLACE TABLE MCCSS.CLIENT_RETENTION_METRICS (
    CLIENT_ID VARCHAR(20) NOT NULL COMMENT 'Unique client identifier within MCCSS programs',
    RETENTION_RATE FLOAT COMMENT 'Percentage of clients retained over specified time period (0-1)',
    SERVICE_PROGRAM VARCHAR(50) COMMENT 'MCCSS program the client is enrolled in',
    SATISFACTION_SCORE FLOAT COMMENT 'Client satisfaction rating (1-10 scale)',
    CHURN_RISK_INDICATOR VARCHAR(10) COMMENT 'Risk level for client disengagement (Low/Medium/High)',
    REGION VARCHAR(30) COMMENT 'Geographic region within Ontario',
    QUARTER DATE COMMENT 'Fiscal quarter of measurement',
    ENGAGEMENT_FREQUENCY NUMBER COMMENT 'Number of interactions per quarter',
    PROGRAM_TYPE VARCHAR(30) COMMENT 'Classification: Employment, Child Care, Home Care, etc.',
    SERVICE_CATEGORY VARCHAR(30) COMMENT 'Service delivery category',
    CASE_LOAD NUMBER COMMENT 'Active cases per worker',
    RENEWAL_COUNT NUMBER COMMENT 'Times client renewed program enrollment',
    DROPOUT_COUNT NUMBER COMMENT 'Times client discontinued services',
    AVG_INTERACTION_DAYS FLOAT COMMENT 'Average days between interactions',
    FIRST_CONTACT_DATE DATE COMMENT 'Date of first program contact',
    LAST_CONTACT_DATE DATE COMMENT 'Date of most recent interaction',
    REFERRAL_SOURCE VARCHAR(30) COMMENT 'How client was referred to program',
    CASE_COMPLEXITY VARCHAR(20) COMMENT 'Complexity tier (Simple/Standard/Complex)',
    NET_PROMOTER_SCORE NUMBER COMMENT 'NPS rating (-100 to 100)',
    RESPONSE_TIME_HOURS FLOAT COMMENT 'Hours to respond to client inquiry',
    DIGITAL_ENGAGEMENT_PCT FLOAT COMMENT 'Percentage of interactions via digital channels',
    IN_PERSON_VISITS NUMBER COMMENT 'Count of in-person service visits',
    PHONE_INTERACTIONS NUMBER COMMENT 'Count of phone-based interactions',
    EMAIL_INTERACTIONS NUMBER COMMENT 'Count of email interactions',
    BENEFITS_AMOUNT FLOAT COMMENT 'Benefits paid to client (CAD)',
    COST_PER_CLIENT FLOAT COMMENT 'Total service cost per client (CAD)',
    FISCAL_YEAR VARCHAR(15) COMMENT 'Ontario fiscal year (Apr-Mar)',
    DATA_QUALITY_SCORE FLOAT COMMENT 'Data quality metric (0-100)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Client retention rates, satisfaction scores, and churn risk indicators across MCCSS service programs. Tracks engagement patterns and program effectiveness for policy planning.';

-- ============================================================
-- MCCSS: Customer Demographics (Story 1 - Basket Item)
-- ============================================================
CREATE OR REPLACE TABLE MCCSS.CUSTOMER_DEMOGRAPHICS (
    CLIENT_ID VARCHAR(20) NOT NULL COMMENT 'Unique client identifier, links to CLIENT_RETENTION_METRICS',
    AGE_GROUP VARCHAR(10) COMMENT 'Age band: 18-24, 25-34, 35-44, 45-54, 55-64, 65+',
    GENDER VARCHAR(20) COMMENT 'Self-reported gender identity',
    POSTAL_CODE_PREFIX VARCHAR(5) COMMENT 'First 3 characters of postal code (FSA)',
    REGION VARCHAR(30) COMMENT 'Geographic region within Ontario',
    HOUSEHOLD_SIZE NUMBER COMMENT 'Number of people in household',
    INCOME_BRACKET VARCHAR(20) COMMENT 'Annual household income range',
    EMPLOYMENT_STATUS VARCHAR(30) COMMENT 'Current employment status',
    EDUCATION_LEVEL VARCHAR(30) COMMENT 'Highest education level attained',
    LANGUAGE_PREFERENCE VARCHAR(20) COMMENT 'Preferred language for service delivery',
    INDIGENOUS_IDENTITY VARCHAR(30) COMMENT 'Self-identified Indigenous status',
    DISABILITY_FLAG VARCHAR(5) COMMENT 'Whether client has registered disability',
    IMMIGRATION_STATUS VARCHAR(20) COMMENT 'Immigration/citizenship status',
    YEARS_IN_CANADA NUMBER COMMENT 'Years since arriving in Canada',
    MARITAL_STATUS VARCHAR(20) COMMENT 'Marital/relationship status',
    DEPENDENTS_COUNT NUMBER COMMENT 'Number of dependents',
    HOUSING_TYPE VARCHAR(20) COMMENT 'Housing arrangement type',
    DIGITAL_ACCESS VARCHAR(10) COMMENT 'Access to digital services (Yes/No/Limited)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Demographic profile of MCCSS program clients. Supports equity analysis, program targeting, and cross-ministry demographic research.';

-- ============================================================
-- FIN: Business Entity Revenue Transactions (Story 2 - Restricted)
-- ============================================================
CREATE OR REPLACE TABLE FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS (
    TRANSACTION_ID VARCHAR(20) NOT NULL COMMENT 'Unique transaction identifier',
    BUSINESS_ENTITY_ID VARCHAR(15) NOT NULL COMMENT 'Unique business entity identifier',
    ENTITY_NAME VARCHAR(100) COMMENT 'Registered business name',
    BUSINESS_TYPE VARCHAR(30) COMMENT 'Business structure type (Corporation, Sole Prop, etc.)',
    SECTOR VARCHAR(30) COMMENT 'Industry sector classification',
    REVENUE_AMOUNT FLOAT COMMENT 'Transaction revenue amount (CAD)',
    TAX_COLLECTED FLOAT COMMENT 'Provincial tax collected (CAD)',
    TRANSACTION_DATE DATE COMMENT 'Date of revenue transaction',
    FISCAL_QUARTER DATE COMMENT 'Fiscal quarter of transaction',
    REGION VARCHAR(30) COMMENT 'Business operating region in Ontario',
    EMPLOYEE_COUNT NUMBER COMMENT 'Number of employees at entity',
    ANNUAL_REVENUE_TIER VARCHAR(20) COMMENT 'Revenue classification tier',
    COMPLIANCE_STATUS VARCHAR(20) COMMENT 'Tax compliance status',
    AUDIT_FLAG VARCHAR(5) COMMENT 'Whether entity is flagged for audit',
    BN_NUMBER VARCHAR(20) COMMENT 'Canada Revenue Agency Business Number',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Business entity revenue transactions for Ontario tax administration. RESTRICTED: Contains confidential financial data subject to Taxpayer Confidentiality provisions.';

-- ============================================================
-- MOH: ER Wait Time Analytics (Story 3 - Publish Candidate)
-- ============================================================
CREATE OR REPLACE TABLE MOH.ER_WAIT_TIME_ANALYTICS (
    VISIT_ID VARCHAR(20) NOT NULL COMMENT 'Unique emergency visit identifier',
    PATIENT_ID VARCHAR(20) NOT NULL COMMENT 'Pseudonymized patient identifier',
    HOSPITAL_ID VARCHAR(15) COMMENT 'Hospital facility identifier',
    TRIAGE_CATEGORY NUMBER COMMENT 'Canadian Triage and Acuity Scale category (1-5)',
    WAIT_MINUTES NUMBER COMMENT 'Time from registration to physician initial assessment',
    TREATMENT_MINUTES NUMBER COMMENT 'Time from assessment to discharge/admit decision',
    ARRIVAL_DATE DATE COMMENT 'Date patient arrived at ER',
    ARRIVAL_HOUR NUMBER COMMENT 'Hour of day patient arrived (0-23)',
    DISCHARGE_STATUS VARCHAR(30) COMMENT 'Final disposition (Discharged, Admitted, LWBS, etc.)',
    PHYSICIAN_ID VARCHAR(15) COMMENT 'Attending physician identifier',
    REGION VARCHAR(30) COMMENT 'Health region / LHIN',
    HOSPITAL_TYPE VARCHAR(20) COMMENT 'Hospital classification (Teaching, Community, Rural)',
    BED_OCCUPANCY_PCT FLOAT COMMENT 'ER bed occupancy at time of arrival (%)',
    AMBULANCE_ARRIVAL VARCHAR(5) COMMENT 'Whether patient arrived by ambulance',
    RETURN_VISIT_72H VARCHAR(5) COMMENT 'Whether patient returned within 72 hours',
    ACUITY_SCORE NUMBER COMMENT 'Clinical acuity score (1-10)',
    CHIEF_COMPLAINT_CATEGORY VARCHAR(30) COMMENT 'Primary reason for visit category',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Emergency department visit analytics: wait times, triage, throughput, and outcomes. Source: MOHLTC Hospital Reporting System + CIHI Emergency Department data.';

-- ============================================================
-- MOH: Patient Outcome Features (Story 4 - AI-Ready)
-- ============================================================
CREATE OR REPLACE TABLE MOH.PATIENT_OUTCOME_FEATURES (
    PATIENT_ID VARCHAR(20) NOT NULL COMMENT 'Pseudonymized patient identifier',
    AGE NUMBER COMMENT 'Patient age at time of feature extraction',
    GENDER VARCHAR(5) COMMENT 'Patient gender (M/F/X)',
    CHRONIC_CONDITIONS_COUNT NUMBER COMMENT 'Number of active chronic conditions',
    PREV_HOSPITALIZATIONS NUMBER COMMENT 'Hospitalizations in prior 12 months',
    MEDICATION_COUNT NUMBER COMMENT 'Active medications count',
    BMI FLOAT COMMENT 'Body Mass Index',
    BLOOD_PRESSURE_SYSTOLIC NUMBER COMMENT 'Most recent systolic BP reading (mmHg)',
    BLOOD_PRESSURE_DIASTOLIC NUMBER COMMENT 'Most recent diastolic BP reading (mmHg)',
    HBA1C FLOAT COMMENT 'Most recent HbA1c measurement (%)',
    READMISSION_RISK_SCORE FLOAT COMMENT 'ML-predicted 30-day readmission probability (0-1)',
    MORTALITY_RISK_SCORE FLOAT COMMENT 'ML-predicted 1-year mortality probability (0-1)',
    LOS_PREDICTED_DAYS FLOAT COMMENT 'Predicted length of stay (days)',
    COMORBIDITY_INDEX NUMBER COMMENT 'Charlson Comorbidity Index score',
    SOCIAL_ISOLATION_SCORE NUMBER COMMENT 'Social determinants risk score (0-10)',
    FEATURE_IMPORTANCE_RANK NUMBER COMMENT 'Rank of this feature set for model training',
    IS_TRAINING_SUITABLE VARCHAR(5) COMMENT 'Whether record meets ML training quality criteria',
    UPDATE_FREQUENCY VARCHAR(20) COMMENT 'How often features are refreshed (Daily/Weekly/Monthly)',
    DATA_QUALITY_SCORE FLOAT COMMENT 'Feature quality score for ML suitability (0-100)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last feature extraction timestamp'
) COMMENT = 'Pre-engineered patient outcome prediction features. AI-Ready: validated for ML model training with quality scores, feature importance rankings, and freshness metadata.';

-- ============================================================
-- EDU: Student Achievement Indicators (Classification Demo)
-- ============================================================
CREATE OR REPLACE TABLE EDU.STUDENT_ACHIEVEMENT_INDICATORS (
    STUDENT_ID VARCHAR(20) NOT NULL COMMENT 'Unique student identifier',
    SCHOOL_ID VARCHAR(15) COMMENT 'School facility identifier',
    SCHOOL_NAME VARCHAR(100) COMMENT 'School name',
    SCHOOL_BOARD VARCHAR(10) COMMENT 'School board code (TDSB, PDSB, etc.)',
    GRADE_LEVEL NUMBER COMMENT 'Current grade level (1-12)',
    MATH_SCORE NUMBER COMMENT 'Standardized math assessment score (0-100)',
    READING_SCORE NUMBER COMMENT 'Standardized reading assessment score (0-100)',
    GRADUATION_RATE FLOAT COMMENT 'Cohort graduation rate (0-1)',
    ATTENDANCE_RATE FLOAT COMMENT 'Average attendance rate (0-1)',
    POSTAL_CODE VARCHAR(5) COMMENT 'Student postal code FSA',
    REGION VARCHAR(30) COMMENT 'Geographic region',
    PROGRAM_TYPE VARCHAR(30) COMMENT 'Educational program stream',
    SPECIAL_EDUCATION VARCHAR(5) COMMENT 'Enrolled in special education (Yes/No)',
    ESL_FLAG VARCHAR(5) COMMENT 'English as Second Language learner (Yes/No)',
    INDIGENOUS_FLAG VARCHAR(5) COMMENT 'Self-identified Indigenous student (Yes/No)',
    SOCIOECONOMIC_INDEX FLOAT COMMENT 'Neighbourhood socioeconomic index (1-10)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Student achievement metrics across Ontario schools. Used for education policy analysis, equity assessment, and program effectiveness evaluation.';

-- ============================================================
-- MTO: Road Infrastructure Metrics (Cross-Domain)
-- ============================================================
CREATE OR REPLACE TABLE MTO.ROAD_INFRASTRUCTURE_METRICS (
    SEGMENT_ID VARCHAR(15) NOT NULL COMMENT 'Road segment unique identifier',
    HIGHWAY_NUMBER VARCHAR(10) COMMENT 'Provincial highway number or designation',
    REGION VARCHAR(30) COMMENT 'MTO administrative region',
    SEGMENT_LENGTH_KM FLOAT COMMENT 'Length of road segment in kilometres',
    LANE_COUNT NUMBER COMMENT 'Number of lanes in segment',
    SURFACE_TYPE VARCHAR(20) COMMENT 'Road surface material type',
    CONDITION_INDEX FLOAT COMMENT 'Pavement condition index (1-10, 10=excellent)',
    LAST_INSPECTION_DATE DATE COMMENT 'Date of most recent condition inspection',
    TRAFFIC_VOLUME_DAILY NUMBER COMMENT 'Average annual daily traffic (AADT)',
    ACCIDENT_COUNT_ANNUAL NUMBER COMMENT 'Reported accidents in segment per year',
    SPEED_LIMIT NUMBER COMMENT 'Posted speed limit (km/h)',
    WINTER_MAINTENANCE_PRIORITY VARCHAR(5) COMMENT 'Winter maintenance priority class (A-D)',
    BRIDGE_COUNT NUMBER COMMENT 'Number of bridges in segment',
    CULVERT_COUNT NUMBER COMMENT 'Number of culverts in segment',
    REHABILITATION_YEAR NUMBER COMMENT 'Planned or actual rehabilitation year',
    ESTIMATED_REPLACEMENT_COST FLOAT COMMENT 'Estimated infrastructure replacement cost (CAD)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Road infrastructure condition, traffic, and maintenance metrics for Ontario provincial highways. Supports capital planning and safety analysis.';

-- ============================================================
-- ENERGY: Grid Telemetry (Cross-Domain)
-- ============================================================
CREATE OR REPLACE TABLE ENERGY.ENERGY_GRID_TELEMETRY (
    READING_ID VARCHAR(20) NOT NULL COMMENT 'Unique telemetry reading identifier',
    STATION_ID VARCHAR(15) COMMENT 'Generation station or substation identifier',
    REGION VARCHAR(30) COMMENT 'Grid region within Ontario',
    READING_TIMESTAMP TIMESTAMP_NTZ COMMENT 'Timestamp of telemetry reading',
    POWER_OUTPUT_MW FLOAT COMMENT 'Power generation output (megawatts)',
    DEMAND_MW FLOAT COMMENT 'Regional demand (megawatts)',
    FREQUENCY_HZ FLOAT COMMENT 'Grid frequency (target 60.00 Hz)',
    VOLTAGE_KV FLOAT COMMENT 'Transmission voltage (kilovolts)',
    TEMPERATURE_C FLOAT COMMENT 'Ambient temperature at station (Celsius)',
    WIND_SPEED_KMH FLOAT COMMENT 'Wind speed at station (km/h)',
    SOLAR_IRRADIANCE FLOAT COMMENT 'Solar irradiance reading (W/m2)',
    GENERATION_TYPE VARCHAR(20) COMMENT 'Energy generation type (Nuclear, Hydro, Wind, Solar, Gas)',
    CAPACITY_FACTOR FLOAT COMMENT 'Actual output / maximum possible output (0-1)',
    EMISSIONS_TONNES_CO2 FLOAT COMMENT 'CO2 emissions for this reading period (tonnes)',
    GRID_STABILITY_INDEX FLOAT COMMENT 'Grid stability indicator (0.8-1.0, 1.0=stable)',
    OUTAGE_FLAG VARCHAR(5) COMMENT 'Whether outage occurred during reading period',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last record update timestamp'
) COMMENT = 'Ontario electricity grid telemetry: generation output, demand, frequency, and stability metrics. Source: IESO real-time monitoring system.';

-- ============================================================
-- LABOUR: Workforce Development Features (Story 4 - AI Dataset)
-- ============================================================
CREATE OR REPLACE TABLE LABOUR.WORKFORCE_DEVELOPMENT_FEATURES (
    PARTICIPANT_ID VARCHAR(20) NOT NULL COMMENT 'Unique program participant identifier',
    AGE NUMBER COMMENT 'Participant age at program entry',
    GENDER VARCHAR(5) COMMENT 'Participant gender (M/F/X)',
    REGION VARCHAR(30) COMMENT 'Home region within Ontario',
    EDUCATION_LEVEL VARCHAR(30) COMMENT 'Education level at program entry',
    PRIOR_EMPLOYMENT_MONTHS NUMBER COMMENT 'Months of employment in prior 5 years',
    TRAINING_PROGRAM VARCHAR(40) COMMENT 'Name of training program enrolled in',
    TRAINING_HOURS NUMBER COMMENT 'Total training hours completed',
    CERTIFICATION_EARNED VARCHAR(5) COMMENT 'Whether certification was earned (Yes/No)',
    EMPLOYMENT_OUTCOME VARCHAR(30) COMMENT 'Employment status 6 months post-program',
    SALARY_POST_TRAINING NUMBER COMMENT 'Annual salary after training (CAD)',
    INDUSTRY_PLACED VARCHAR(30) COMMENT 'Industry of post-training employment',
    TIME_TO_EMPLOYMENT_DAYS NUMBER COMMENT 'Days from program completion to employment',
    RETENTION_6_MONTH VARCHAR(5) COMMENT 'Still employed 6 months post-placement (Yes/No)',
    SKILL_MATCH_SCORE FLOAT COMMENT 'Match between training and job placement (0-1)',
    FEATURE_IMPORTANCE_RANK NUMBER COMMENT 'Rank of this feature set for outcome prediction',
    IS_TRAINING_SUITABLE VARCHAR(5) COMMENT 'Whether record meets ML training quality criteria',
    UPDATE_FREQUENCY VARCHAR(20) COMMENT 'Feature refresh cadence (Weekly/Monthly)',
    LAST_UPDATED TIMESTAMP_NTZ COMMENT 'Last feature extraction timestamp'
) COMMENT = 'Workforce development program features for employment outcome prediction. AI-Ready: validated for ML training with quality scores and feature importance.';
