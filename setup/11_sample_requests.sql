-- ============================================================
-- 11: Sample Access Requests (Pre-seed for Demo)
-- ============================================================
USE DATABASE ON_GOVERNANCE_RFS;
USE SCHEMA PUBLIC;

-- Clear existing
TRUNCATE TABLE ACCESS_REQUESTS;

-- Pre-seed with realistic request history
INSERT INTO ACCESS_REQUESTS (REQUESTOR_ROLE, REQUESTOR_NAME, TARGET_TABLE, PURPOSE, SENSITIVITY_LEVEL, STATUS, APPROVED_BY, REQUESTED_AT, RESOLVED_AT, POLICY_EVALUATION)
VALUES
-- Approved requests (show history)
('OPS_DATA_ANALYST', 'Maria Santos', 'MOH.ER_WAIT_TIME_ANALYTICS',
 'Cross-ministry healthcare performance report for Q2 2026 Cabinet briefing',
 'INTERNAL', 'APPROVED', 'Dr. Rajesh Patel',
 '2026-08-15 09:30:00', '2026-08-15 10:15:00',
 '{"role_eligible": true, "sensitivity": "INTERNAL", "requires_approval": true, "routed_to": "Dr. Rajesh Patel"}'),

('OPS_DATA_SCIENTIST', 'Alex Kim', 'MOH.PATIENT_OUTCOME_FEATURES',
 'Training readmission prediction model for Ontario Health Teams initiative',
 'RESTRICTED', 'APPROVED', 'Dr. Rajesh Patel',
 '2026-08-12 14:00:00', '2026-08-13 08:45:00',
 '{"role_eligible": true, "sensitivity": "RESTRICTED", "requires_approval": true, "routed_to": "Dr. Rajesh Patel"}'),

('OPS_DATA_ANALYST', 'Priya Venkatesh', 'MCCSS.CLIENT_RETENTION_METRICS',
 'Program effectiveness analysis for annual ministry report',
 'INTERNAL', 'APPROVED', 'Sarah Chen',
 '2026-08-10 11:00:00', '2026-08-10 11:30:00',
 '{"role_eligible": true, "sensitivity": "INTERNAL", "requires_approval": true, "routed_to": "Sarah Chen"}'),

-- Rejected request (show governance working)
('OPS_GENERAL_USER', 'Tom Baker', 'FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS',
 'General interest in business data for personal project',
 'RESTRICTED', 'REJECTED', 'David Park',
 '2026-08-08 16:00:00', '2026-08-09 09:00:00',
 '{"role_eligible": true, "sensitivity": "RESTRICTED", "requires_approval": true, "routed_to": "David Park", "rejection_reason": "Purpose does not meet minimum business justification for RESTRICTED financial data"}'),

-- Pending request (for live demo - Story 2)
('OPS_GENERAL_USER', 'James Wilson', 'FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS',
 'Cross-ministry affordability analysis per Deputy Minister directive Q3-2026. Need revenue distribution data for income-stratified program uptake modeling.',
 'RESTRICTED', 'PENDING', NULL,
 CURRENT_TIMESTAMP(), NULL,
 '{"role_eligible": true, "sensitivity": "RESTRICTED", "requires_approval": true, "routed_to": "David Park", "policy": "Owner Approval Required"}'),

-- Another pending (backup for demo)
('OPS_DATA_SCIENTIST', 'Sarah Liang', 'MCCSS.CUSTOMER_DEMOGRAPHICS',
 'Building demographic feature set for service demand forecasting model - MCCSS Analytics Division',
 'RESTRICTED', 'PENDING', NULL,
 CURRENT_TIMESTAMP(), NULL,
 '{"role_eligible": true, "sensitivity": "RESTRICTED", "requires_approval": true, "routed_to": "Sarah Chen", "policy": "Owner Approval Required"}');

-- Verify
SELECT STATUS, COUNT(*) AS CNT FROM ACCESS_REQUESTS GROUP BY STATUS;
