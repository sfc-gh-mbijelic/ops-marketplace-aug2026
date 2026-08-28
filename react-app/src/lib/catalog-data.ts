export interface Column {
  name: string;
  type: string;
  description: string;
  sensitivity?: string;
  feature_importance?: number;
}

export interface DataProduct {
  id: string;
  name: string;
  display_name: string;
  domain: string;
  certification: string;
  sensitivity: string;
  ai_ready: boolean;
  ml_enabled: boolean;
  data_owner: string;
  data_steward: string;
  description: string;
  row_count: number;
  last_updated: string;
  quality: { completeness: number; consistency: number; freshness: string; trust_score: number };
  usage: { weekly_queries: number; unique_users: number; trending: boolean };
  columns: Column[];
  lineage: { sources: string[]; transformations: string[]; downstream: string[] };
  delivery_methods: string[];
  accessible_by: string[];
  tags: string[];
  update_frequency: string;
}

export const ROLE_MAP: Record<string, string> = {
  'Data Analyst': 'OPS_DATA_ANALYST',
  'General User': 'OPS_GENERAL_USER',
  'Data Scientist': 'OPS_DATA_SCIENTIST',
  'Contributor': 'OPS_CONTRIBUTOR',
};

export function getDatasetsForRole(persona: string): DataProduct[] {
  const role = ROLE_MAP[persona] || 'OPS_GENERAL_USER';
  return Object.values(CATALOG).filter(d => d.accessible_by.includes(role));
}

export const CATALOG: Record<string, DataProduct> = {
  'MCCSS.CLIENT_RETENTION_METRICS': {
    id: 'MCCSS.CLIENT_RETENTION_METRICS',
    name: 'CLIENT_RETENTION_METRICS',
    display_name: 'Client Retention Metrics',
    domain: 'MCCSS',
    certification: 'Authoritative',
    sensitivity: 'INTERNAL',
    ai_ready: true,
    ml_enabled: false,
    data_owner: 'Sarah Chen',
    data_steward: 'Michael Torres',
    description: 'Client retention rates, satisfaction scores, and churn risk indicators across MCCSS service programs. Tracks engagement patterns and program effectiveness for policy planning.',
    row_count: 50000,
    last_updated: '2026-08-25',
    quality: { completeness: 96, consistency: 97, freshness: 'Daily', trust_score: 94 },
    usage: { weekly_queries: 142, unique_users: 28, trending: true },
    columns: [
      { name: 'CLIENT_ID', type: 'VARCHAR', description: 'Unique client identifier within MCCSS programs' },
      { name: 'RETENTION_RATE', type: 'FLOAT', description: 'Percentage of clients retained over specified time period (0-1)' },
      { name: 'SERVICE_PROGRAM', type: 'VARCHAR', description: 'MCCSS program the client is enrolled in' },
      { name: 'SATISFACTION_SCORE', type: 'FLOAT', description: 'Client satisfaction rating (1-10 scale)' },
      { name: 'CHURN_RISK_INDICATOR', type: 'VARCHAR', description: 'Risk level for client disengagement (Low/Medium/High)' },
      { name: 'REGION', type: 'VARCHAR', description: 'Geographic region within Ontario' },
      { name: 'QUARTER', type: 'DATE', description: 'Fiscal quarter of measurement' },
      { name: 'ENGAGEMENT_FREQUENCY', type: 'NUMBER', description: 'Number of interactions per quarter' },
      { name: 'NET_PROMOTER_SCORE', type: 'NUMBER', description: 'NPS rating (-100 to 100)' },
      { name: 'COST_PER_CLIENT', type: 'FLOAT', description: 'Total service cost per client (CAD)' },
      { name: 'DATA_QUALITY_SCORE', type: 'FLOAT', description: 'Data quality metric (0-100)' },
    ],
    lineage: { sources: ['MCCSS Case Management DB', 'ServiceOntario CRM'], transformations: ['Daily ETL + quality scoring + churn model inference'], downstream: ['Monthly KPI Report', 'Program Effectiveness Dashboard', 'Minister Briefing'] },
    delivery_methods: ['TABLE', 'API'],
    accessible_by: ['OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['retention', 'social-services', 'client-outcomes', 'program-effectiveness'],
    update_frequency: 'Daily',
  },

  'MCCSS.CUSTOMER_DEMOGRAPHICS': {
    id: 'MCCSS.CUSTOMER_DEMOGRAPHICS',
    name: 'CUSTOMER_DEMOGRAPHICS',
    display_name: 'Customer Demographics',
    domain: 'MCCSS',
    certification: 'Certified',
    sensitivity: 'RESTRICTED',
    ai_ready: true,
    ml_enabled: false,
    data_owner: 'Sarah Chen',
    data_steward: 'Michael Torres',
    description: 'Demographic profile of MCCSS program clients. Supports equity analysis, program targeting, and cross-ministry demographic research.',
    row_count: 45000,
    last_updated: '2026-08-24',
    quality: { completeness: 94, consistency: 96, freshness: 'Daily', trust_score: 92 },
    usage: { weekly_queries: 87, unique_users: 19, trending: false },
    columns: [
      { name: 'CLIENT_ID', type: 'VARCHAR', description: 'Unique client identifier, links to CLIENT_RETENTION_METRICS', sensitivity: 'RESTRICTED' },
      { name: 'AGE_GROUP', type: 'VARCHAR', description: 'Age band: 18-24, 25-34, 35-44, 45-54, 55-64, 65+' },
      { name: 'REGION', type: 'VARCHAR', description: 'Geographic region within Ontario' },
      { name: 'INCOME_BRACKET', type: 'VARCHAR', description: 'Annual household income range' },
      { name: 'EMPLOYMENT_STATUS', type: 'VARCHAR', description: 'Current employment status' },
      { name: 'POSTAL_CODE_PREFIX', type: 'VARCHAR', description: 'First 3 characters of postal code (FSA)', sensitivity: 'RESTRICTED' },
      { name: 'INDIGENOUS_IDENTITY', type: 'VARCHAR', description: 'Self-identified Indigenous status', sensitivity: 'RESTRICTED' },
    ],
    lineage: { sources: ['ServiceOntario Identity DB', 'StatsCan Census Linkage'], transformations: ['Weekly demographic refresh + anonymization'], downstream: ['Equity Impact Assessments', 'Program Targeting Models'] },
    delivery_methods: ['TABLE', 'VIEW'],
    accessible_by: ['OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['demographics', 'equity', 'social-services', 'population'],
    update_frequency: 'Weekly',
  },

  'FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS': {
    id: 'FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS',
    name: 'BUSINESS_ENTITY_REVENUE_TRANSACTIONS',
    display_name: 'Business Entity Revenue Transactions',
    domain: 'FIN',
    certification: 'Authoritative',
    sensitivity: 'RESTRICTED',
    ai_ready: false,
    ml_enabled: false,
    data_owner: 'David Park',
    data_steward: 'Angela Rossi',
    description: 'Business entity revenue transactions for Ontario tax administration. Contains confidential financial data subject to Taxpayer Confidentiality provisions.',
    row_count: 250000,
    last_updated: '2026-08-26',
    quality: { completeness: 98, consistency: 99, freshness: 'Daily', trust_score: 97 },
    usage: { weekly_queries: 56, unique_users: 8, trending: false },
    columns: [
      { name: 'TRANSACTION_ID', type: 'VARCHAR', description: 'Unique transaction identifier' },
      { name: 'BUSINESS_ENTITY_ID', type: 'VARCHAR', description: 'Unique business entity identifier' },
      { name: 'ENTITY_NAME', type: 'VARCHAR', description: 'Registered business name', sensitivity: 'RESTRICTED' },
      { name: 'REVENUE_AMOUNT', type: 'FLOAT', description: 'Transaction revenue amount (CAD)', sensitivity: 'RESTRICTED' },
      { name: 'TAX_COLLECTED', type: 'FLOAT', description: 'Provincial tax collected (CAD)', sensitivity: 'RESTRICTED' },
      { name: 'BN_NUMBER', type: 'VARCHAR', description: 'Canada Revenue Agency Business Number', sensitivity: 'RESTRICTED' },
      { name: 'SECTOR', type: 'VARCHAR', description: 'Industry sector classification' },
      { name: 'REGION', type: 'VARCHAR', description: 'Business operating region in Ontario' },
    ],
    lineage: { sources: ['Ontario Tax Revenue System', 'CRA Business Registry'], transformations: ['Daily reconciliation + compliance scoring'], downstream: ['Provincial Budget Forecasting', 'Tax Compliance Reports'] },
    delivery_methods: ['VIEW'],
    accessible_by: ['OPS_DATA_OWNER'],
    tags: ['finance', 'revenue', 'tax', 'business-entities', 'confidential'],
    update_frequency: 'Daily',
  },

  'MOH.ER_WAIT_TIME_ANALYTICS': {
    id: 'MOH.ER_WAIT_TIME_ANALYTICS',
    name: 'ER_WAIT_TIME_ANALYTICS',
    display_name: 'ER Wait Time Analytics',
    domain: 'MOH',
    certification: 'Authoritative',
    sensitivity: 'INTERNAL',
    ai_ready: false,
    ml_enabled: false,
    data_owner: 'Dr. Rajesh Patel',
    data_steward: 'Emily Watson',
    description: 'Emergency department visit analytics: wait times, triage, throughput, and outcomes. Source: MOHLTC Hospital Reporting System + CIHI Emergency Department data.',
    row_count: 120000,
    last_updated: '2026-08-27',
    quality: { completeness: 92, consistency: 95, freshness: 'Daily', trust_score: 91 },
    usage: { weekly_queries: 180, unique_users: 34, trending: true },
    columns: [
      { name: 'VISIT_ID', type: 'VARCHAR', description: 'Unique emergency visit identifier' },
      { name: 'PATIENT_ID', type: 'VARCHAR', description: 'Pseudonymized patient identifier', sensitivity: 'RESTRICTED' },
      { name: 'HOSPITAL_ID', type: 'VARCHAR', description: 'Hospital facility identifier' },
      { name: 'TRIAGE_CATEGORY', type: 'NUMBER', description: 'Canadian Triage and Acuity Scale category (1-5)' },
      { name: 'WAIT_MINUTES', type: 'NUMBER', description: 'Time from registration to physician initial assessment' },
      { name: 'TREATMENT_MINUTES', type: 'NUMBER', description: 'Time from assessment to discharge/admit decision' },
      { name: 'REGION', type: 'VARCHAR', description: 'Health region / LHIN' },
      { name: 'BED_OCCUPANCY_PCT', type: 'FLOAT', description: 'ER bed occupancy at time of arrival (%)' },
    ],
    lineage: { sources: ['MOHLTC Hospital Reporting System', 'CIHI Emergency Department Database'], transformations: ['Daily ETL + quality scoring + outlier detection'], downstream: ['Minister ER Performance Dashboard', 'Hospital Capacity Report', 'Wait Times Improvement Model'] },
    delivery_methods: ['TABLE', 'API'],
    accessible_by: ['OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['healthcare', 'emergency', 'wait-times', 'hospitals', 'performance'],
    update_frequency: 'Daily',
  },

  'MOH.PATIENT_OUTCOME_FEATURES': {
    id: 'MOH.PATIENT_OUTCOME_FEATURES',
    name: 'PATIENT_OUTCOME_FEATURES',
    display_name: 'Patient Outcome Features',
    domain: 'MOH',
    certification: 'Authoritative',
    sensitivity: 'RESTRICTED',
    ai_ready: true,
    ml_enabled: true,
    data_owner: 'Dr. Rajesh Patel',
    data_steward: 'Emily Watson',
    description: 'Pre-engineered patient outcome prediction features. AI-Ready: validated for ML model training with quality scores, feature importance rankings, and freshness metadata.',
    row_count: 80000,
    last_updated: '2026-08-27',
    quality: { completeness: 97, consistency: 98, freshness: 'Daily', trust_score: 96 },
    usage: { weekly_queries: 64, unique_users: 12, trending: true },
    columns: [
      { name: 'PATIENT_ID', type: 'VARCHAR', description: 'Pseudonymized patient identifier', sensitivity: 'RESTRICTED', feature_importance: 0 },
      { name: 'AGE', type: 'NUMBER', description: 'Patient age at time of feature extraction', feature_importance: 8 },
      { name: 'CHRONIC_CONDITIONS_COUNT', type: 'NUMBER', description: 'Number of active chronic conditions', feature_importance: 9 },
      { name: 'PREV_HOSPITALIZATIONS', type: 'NUMBER', description: 'Hospitalizations in prior 12 months', feature_importance: 10 },
      { name: 'MEDICATION_COUNT', type: 'NUMBER', description: 'Active medications count', feature_importance: 7 },
      { name: 'BMI', type: 'FLOAT', description: 'Body Mass Index', feature_importance: 5 },
      { name: 'READMISSION_RISK_SCORE', type: 'FLOAT', description: 'ML-predicted 30-day readmission probability (0-1)', feature_importance: 10 },
      { name: 'MORTALITY_RISK_SCORE', type: 'FLOAT', description: 'ML-predicted 1-year mortality probability (0-1)', feature_importance: 10 },
      { name: 'COMORBIDITY_INDEX', type: 'NUMBER', description: 'Charlson Comorbidity Index score', feature_importance: 9 },
      { name: 'SOCIAL_ISOLATION_SCORE', type: 'NUMBER', description: 'Social determinants risk score (0-10)', feature_importance: 6 },
      { name: 'IS_TRAINING_SUITABLE', type: 'VARCHAR', description: 'Whether record meets ML training quality criteria' },
      { name: 'DATA_QUALITY_SCORE', type: 'FLOAT', description: 'Feature quality score for ML suitability (0-100)' },
    ],
    lineage: { sources: ['Ontario Health Data Platform', 'CIHI Discharge Abstract Database', 'Ontario Drug Benefit Claims'], transformations: ['Weekly feature engineering + quality scoring + model inference'], downstream: ['Readmission Prediction Model', 'Population Health Analytics', 'Ontario Health Teams Dashboard'] },
    delivery_methods: ['FEATURE_TABLE', 'API'],
    accessible_by: ['OPS_DATA_SCIENTIST', 'OPS_DATA_OWNER'],
    tags: ['ai-ready', 'ml-features', 'healthcare', 'outcomes-prediction', 'feature-store'],
    update_frequency: 'Weekly',
  },

  'EDU.STUDENT_ACHIEVEMENT_INDICATORS': {
    id: 'EDU.STUDENT_ACHIEVEMENT_INDICATORS',
    name: 'STUDENT_ACHIEVEMENT_INDICATORS',
    display_name: 'Student Achievement Indicators',
    domain: 'EDU',
    certification: 'Draft',
    sensitivity: 'INTERNAL',
    ai_ready: false,
    ml_enabled: false,
    data_owner: 'Jennifer Wu',
    data_steward: 'Robert Okafor',
    description: 'Student achievement metrics across Ontario schools. Used for education policy analysis, equity assessment, and program effectiveness evaluation.',
    row_count: 200000,
    last_updated: '2026-08-20',
    quality: { completeness: 78, consistency: 85, freshness: 'Monthly', trust_score: 72 },
    usage: { weekly_queries: 23, unique_users: 6, trending: false },
    columns: [
      { name: 'STUDENT_ID', type: 'VARCHAR', description: 'Unique student identifier', sensitivity: 'RESTRICTED' },
      { name: 'SCHOOL_NAME', type: 'VARCHAR', description: 'School name' },
      { name: 'GRADE_LEVEL', type: 'NUMBER', description: 'Current grade level (1-12)' },
      { name: 'MATH_SCORE', type: 'NUMBER', description: 'Standardized math assessment score (0-100)' },
      { name: 'READING_SCORE', type: 'NUMBER', description: 'Standardized reading assessment score (0-100)' },
      { name: 'GRADUATION_RATE', type: 'FLOAT', description: 'Cohort graduation rate (0-1)' },
      { name: 'POSTAL_CODE', type: 'VARCHAR', description: 'Student postal code FSA', sensitivity: 'RESTRICTED' },
    ],
    lineage: { sources: ['EQAO Assessment System', 'OnSIS Student Information System'], transformations: ['Annual refresh + anonymization + equity scoring'], downstream: ['Education Equity Report', 'School Performance Rankings'] },
    delivery_methods: ['TABLE'],
    accessible_by: ['OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['education', 'students', 'achievement', 'equity'],
    update_frequency: 'Monthly',
  },

  'MTO.ROAD_INFRASTRUCTURE_METRICS': {
    id: 'MTO.ROAD_INFRASTRUCTURE_METRICS',
    name: 'ROAD_INFRASTRUCTURE_METRICS',
    display_name: 'Road Infrastructure Metrics',
    domain: 'MTO',
    certification: 'Certified',
    sensitivity: 'PUBLIC',
    ai_ready: false,
    ml_enabled: false,
    data_owner: 'Mark Thompson',
    data_steward: 'Lisa Nguyen',
    description: 'Road infrastructure condition, traffic, and maintenance metrics for Ontario provincial highways. Supports capital planning and safety analysis.',
    row_count: 35000,
    last_updated: '2026-08-22',
    quality: { completeness: 91, consistency: 94, freshness: 'Weekly', trust_score: 89 },
    usage: { weekly_queries: 45, unique_users: 15, trending: false },
    columns: [
      { name: 'SEGMENT_ID', type: 'VARCHAR', description: 'Road segment unique identifier' },
      { name: 'HIGHWAY_NUMBER', type: 'VARCHAR', description: 'Provincial highway number or designation' },
      { name: 'CONDITION_INDEX', type: 'FLOAT', description: 'Pavement condition index (1-10, 10=excellent)' },
      { name: 'TRAFFIC_VOLUME_DAILY', type: 'NUMBER', description: 'Average annual daily traffic (AADT)' },
      { name: 'ACCIDENT_COUNT_ANNUAL', type: 'NUMBER', description: 'Reported accidents in segment per year' },
    ],
    lineage: { sources: ['MTO Road Condition Inventory', 'Traffic Volume Database'], transformations: ['Weekly condition refresh + safety scoring'], downstream: ['Capital Planning Model', 'Road Safety Report'] },
    delivery_methods: ['TABLE', 'API'],
    accessible_by: ['OPS_GENERAL_USER', 'OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['infrastructure', 'roads', 'highways', 'transportation', 'public-safety'],
    update_frequency: 'Weekly',
  },

  'ENERGY.ENERGY_GRID_TELEMETRY': {
    id: 'ENERGY.ENERGY_GRID_TELEMETRY',
    name: 'ENERGY_GRID_TELEMETRY',
    display_name: 'Energy Grid Telemetry',
    domain: 'ENERGY',
    certification: 'Certified',
    sensitivity: 'PUBLIC',
    ai_ready: true,
    ml_enabled: false,
    data_owner: 'Priya Sharma',
    data_steward: 'James Liu',
    description: 'Ontario electricity grid telemetry: generation output, demand, frequency, and stability metrics. Source: IESO real-time monitoring system.',
    row_count: 500000,
    last_updated: '2026-08-28',
    quality: { completeness: 95, consistency: 97, freshness: 'Hourly', trust_score: 94 },
    usage: { weekly_queries: 112, unique_users: 22, trending: true },
    columns: [
      { name: 'STATION_ID', type: 'VARCHAR', description: 'Generation station or substation identifier' },
      { name: 'POWER_OUTPUT_MW', type: 'FLOAT', description: 'Power generation output (megawatts)' },
      { name: 'DEMAND_MW', type: 'FLOAT', description: 'Regional demand (megawatts)' },
      { name: 'GENERATION_TYPE', type: 'VARCHAR', description: 'Energy generation type (Nuclear, Hydro, Wind, Solar, Gas)' },
      { name: 'CAPACITY_FACTOR', type: 'FLOAT', description: 'Actual output / maximum possible output (0-1)' },
      { name: 'GRID_STABILITY_INDEX', type: 'FLOAT', description: 'Grid stability indicator (0.8-1.0, 1.0=stable)' },
    ],
    lineage: { sources: ['IESO Real-Time Monitoring', 'Ontario Power Generation SCADA'], transformations: ['Hourly aggregation + anomaly detection + capacity scoring'], downstream: ['Grid Stability Dashboard', 'Demand Forecasting Model', 'Green Energy Report'] },
    delivery_methods: ['TABLE', 'API', 'FEATURE_TABLE'],
    accessible_by: ['OPS_GENERAL_USER', 'OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['energy', 'grid', 'telemetry', 'sustainability', 'real-time'],
    update_frequency: 'Hourly',
  },

  'LABOUR.WORKFORCE_DEVELOPMENT_FEATURES': {
    id: 'LABOUR.WORKFORCE_DEVELOPMENT_FEATURES',
    name: 'WORKFORCE_DEVELOPMENT_FEATURES',
    display_name: 'Workforce Development Features',
    domain: 'LABOUR',
    certification: 'Certified',
    sensitivity: 'INTERNAL',
    ai_ready: true,
    ml_enabled: true,
    data_owner: 'Karen Fletcher',
    data_steward: 'Ahmed Hassan',
    description: 'Workforce development program features for employment outcome prediction. AI-Ready: validated for ML training with quality scores and feature importance.',
    row_count: 30000,
    last_updated: '2026-08-26',
    quality: { completeness: 93, consistency: 95, freshness: 'Weekly', trust_score: 91 },
    usage: { weekly_queries: 38, unique_users: 9, trending: false },
    columns: [
      { name: 'PARTICIPANT_ID', type: 'VARCHAR', description: 'Unique program participant identifier' },
      { name: 'AGE', type: 'NUMBER', description: 'Participant age at program entry', feature_importance: 6 },
      { name: 'TRAINING_PROGRAM', type: 'VARCHAR', description: 'Name of training program enrolled in', feature_importance: 8 },
      { name: 'TRAINING_HOURS', type: 'NUMBER', description: 'Total training hours completed', feature_importance: 9 },
      { name: 'EMPLOYMENT_OUTCOME', type: 'VARCHAR', description: 'Employment status 6 months post-program', feature_importance: 10 },
      { name: 'SALARY_POST_TRAINING', type: 'NUMBER', description: 'Annual salary after training (CAD)', feature_importance: 7 },
      { name: 'SKILL_MATCH_SCORE', type: 'FLOAT', description: 'Match between training and job placement (0-1)', feature_importance: 9 },
      { name: 'TIME_TO_EMPLOYMENT_DAYS', type: 'NUMBER', description: 'Days from program completion to employment', feature_importance: 8 },
      { name: 'RETENTION_6_MONTH', type: 'VARCHAR', description: 'Still employed 6 months post-placement (Yes/No)', feature_importance: 10 },
    ],
    lineage: { sources: ['Employment Ontario Case Management', 'Service Canada Job Bank', 'Ontario Training Institutes'], transformations: ['Monthly feature engineering + outcome tracking + quality scoring'], downstream: ['Employment Outcome Prediction Model', 'Program ROI Analysis', 'Skills Gap Dashboard'] },
    delivery_methods: ['FEATURE_TABLE', 'API'],
    accessible_by: ['OPS_DATA_ANALYST', 'OPS_DATA_SCIENTIST', 'OPS_CONTRIBUTOR', 'OPS_DATA_STEWARD', 'OPS_DATA_OWNER'],
    tags: ['ai-ready', 'ml-features', 'workforce', 'employment', 'training-outcomes'],
    update_frequency: 'Monthly',
  },
};
