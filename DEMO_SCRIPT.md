# OPS Data Marketplace — 150-Minute Demo Script
## RFS-SPDP-2026-06 — Stage 2 Live Demonstration (80 Points)

---

## Pre-Demo Checklist

- [ ] SPCS React App loaded (or local dev server running)
- [ ] Streamlit Governance Console open in Snowsight
- [ ] Snowsight worksheet open (ON_GOVERNANCE_RFS database selected)
- [ ] Internal Marketplace tab open in Snowsight
- [ ] Run `scripts/reset_demo.sh` for fresh state
- [ ] Persona set to "Data Analyst" on React app

---

## Opening (10 minutes)

> "Good morning. I'm presenting Snowflake Horizon — the governance platform built into Snowflake. What makes our approach different is that governance isn't a sidecar or overlay — it's compiled directly into the query execution engine. Every policy, every mask, every access control executes at query time with zero added latency."

**Show architecture slide (1 slide, 2 minutes max):**
- Snowflake Horizon = unified governance layer
- Tags drive policies, policies execute at query time
- Internal Marketplace = native data product catalog
- DMFs = native data quality monitoring

> "Today I'll walk through four scenarios that map directly to your RFS requirements. Everything is live. Let's begin."

---
---

## DEMONSTRATION STORY 1: Discovering and Accessing Data (30 min) — 10 Points

### Context
> "Maria is a Data Analyst. She needs to find 'client retention metrics' data, filtered by Authoritative and AI-Ready, view column-level lineage, and add it to a basket alongside customer demographics for a single provisioned request."

---

### AC-1.1: Data marketplace homepage is presented
**[SNOWSIGHT — Data Products > Internal Marketplace]** (2 min)

> "This is the native Snowflake Internal Marketplace — the product's built-in data product catalog."

**Actions:**
- Show the Internal Marketplace homepage with organization listings
- Point to categories, tiles, search

**[REACT APP — Homepage]**

> "And this is the OPS Data Marketplace portal — extending the native platform with a richer consumer experience."

**Actions:**
- Show the 9-product grid with badges, trust scores, usage metrics
- Point out the navigation: Usage, ML Delivery, Publish

---

### AC-1.2: The User can search for a data asset like 'client retention metrics'
**[REACT APP — Search Bar]** (3 min)

**Actions:**
- Type: "client retention metrics"
- Press Search

> "Powered by Snowflake Cortex Search — vector-based semantic search across dataset names, column definitions, business glossary terms, and tags."

---

### AC-1.3: The system can return a list of relevant data assets
**[REACT APP — Search Results]** (2 min)

**Actions:**
- Show the search results highlighting CLIENT_RETENTION_METRICS as top result
- Point to relevance ranking

> "Semantic understanding — not keyword matching. Let me prove it."

**Actions:**
- Clear and search: "how well are we keeping our clients"
- Same dataset surfaces

> "Completely different phrasing, same result. Critical when you have 8,000+ data products."

---

### AC-1.4: The User can filter search results by certification labels such as 'Authoritative' and 'AI-Ready'
**[REACT APP — Filter Buttons]** (2 min)

**Actions:**
- Click "Authoritative" filter pill
- Click "AI-Ready" filter pill
- Show filtered results

> "Maria filters by Authoritative AND AI-Ready. The result set narrows to only datasets that meet both criteria."

---

### AC-1.5: The search results shall prominently display these certification labels
**[REACT APP — Dataset Cards]** (1 min)

**Actions:**
- Point to certification badges on each card: green "Authoritative", violet "AI-Ready"
- Point to sensitivity indicators, trust scores

> "Every card shows certification prominently. Color-coded: green for Authoritative, violet for AI-Ready, sky blue for Certified. Plus sensitivity level and trust score at a glance."

---

### AC-1.6: Demonstrate AI-driven recommendations for related data products
**[REACT APP — Dataset Detail → Related Products]** (3 min)

**Actions:**
- Click into CLIENT_RETENTION_METRICS
- Show "AI Recommendations" / related products suggestion area
- Point to CUSTOMER_DEMOGRAPHICS recommended (same domain, shared tags)

> "The system recommends related data products based on domain overlap, tag similarity, and co-query patterns. It suggests Customer Demographics — same ministry, shared tags, frequently JOINed together."

---

### AC-1.7: The User can select a data product from the results
**[REACT APP — Dataset Detail]** (1 min)

**Actions:**
- Already clicked into the dataset detail view
- Show: full metadata, schema, quality, lineage tabs

---

### AC-1.8: Selected data product presents column-level lineage to understand its origin and transformations
**[REACT APP — Lineage Tab]** (4 min)

**Actions:**
- Click "Lineage" tab
- Show the SVG DAG diagram:
  - Blue boxes (sources): MCCSS Case Management DB, ServiceOntario CRM
  - Amber box (transformation): Daily ETL + quality scoring + churn model inference
  - Green box (current): Client Retention Metrics
  - Violet boxes (downstream): Monthly KPI Report, Program Effectiveness Dashboard, Minister Briefing

> "Column-level lineage: sourced from two systems, transformed daily, feeds three downstream consumers. This is traced automatically via Snowflake ACCESS_HISTORY — no manual documentation required."

**[SNOWSIGHT — verification]**
```sql
SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.ACCESS_HISTORY
WHERE ARRAY_TO_STRING(base_objects_accessed, ',') ILIKE '%CLIENT_RETENTION%'
ORDER BY query_start_time DESC LIMIT 5;
```

---

### AC-1.9: The User can select and add data products to a 'data basket' or 'shopping cart'
**[REACT APP — Add to Basket]** (2 min)

**Actions:**
- Click "Add to Basket" button
- Show toast notification: "Added Client Retention Metrics to basket"
- Open basket sidebar — show 1 item

---

### AC-1.10: The User can select and add other related data products, like a customer demographics dataset, to the same basket
**[REACT APP — Navigate to Customer Demographics]** (2 min)

**Actions:**
- Click back to marketplace
- Find CUSTOMER_DEMOGRAPHICS (recommended related product)
- Click into it, click "Add to Basket"
- Open basket — show 2 items from different sensitivity levels

---

### AC-1.11: Upon checkout, the data request shall be processed as a single request for all assets in the basket
**[REACT APP — Basket Sidebar → Checkout]** (3 min)

**Actions:**
- Open basket sidebar
- Show policy evaluation summary:
  - Role: OPS_DATA_ANALYST
  - Datasets: 2
  - Auto-provision (PUBLIC): 0
  - Requires approval: 2
- Click "Checkout & Provision All"
- Show single request submitted

> "A single request for both datasets. The system processes the entire basket as one provisioning event."

---

### AC-1.12: Demonstrate that if policy conditions are met, the User's access shall be automatically provisioned without manual intervention
**[REACT APP — Notification]** (2 min)

**Actions:**
- Show toast: "Access provisioned for 2 dataset(s). Data is now available."
- Show the GRANT executed behind the scenes

> "For the Data Analyst role: CLIENT_RETENTION_METRICS is INTERNAL — policy allows auto-provisioning for analysts. No manual approval needed. CUSTOMER_DEMOGRAPHICS is RESTRICTED — that one routes to the owner. But the provisioning for the eligible dataset happened instantly, no human in the loop."

**[SNOWSIGHT — verify]**
```sql
SHOW GRANTS TO ROLE OPS_DATA_ANALYST;
```

---

### [COMMON CRITERIA: Usage Tracking]
> "Notice usage metrics on every card: 142 queries per week, 28 unique users, trending indicator. That's live data from SNOWFLAKE.ACCOUNT_USAGE.QUERY_HISTORY."

### [COMMON CRITERIA: Cross-Domain Composition]
> "Maria just combined MCCSS retention data + MCCSS demographics in one basket. Cross-domain composition: one request, multiple datasets from different sensitivity levels, same governance framework."

### [COMMON CRITERIA: Policy-as-Code]
> "The auto-provisioning logic reads the SENSITIVITY tag at runtime. We never hardcoded 'auto-approve for analysts.' The tag IS the policy."

---
---

## DEMONSTRATION STORY 2: Requests Restricted Data with Policy-Aware Approval (30 min) — 10 Points

### Context
> "James is a General User from Finance. He needs the sensitive 'Business Entity Revenue Transactions' dataset. He doesn't currently have access."

---

### AC-2.1: The Data Marketplace homepage is presented
**[REACT APP — Homepage]** (1 min)

**Actions:**
- Show marketplace homepage (already open)
- Switch persona to "General User"

---

### AC-2.2: The Business User searches for a data product such as "Business Entity Revenue Transactions"
**[REACT APP — Search]** (2 min)

**Actions:**
- Type: "Business Entity Revenue Transactions"
- Show results

---

### AC-2.3: The system returns relevant data products and clearly indicates that the dataset is Restricted or Sensitive
**[REACT APP — Results]** (2 min)

**Actions:**
- Point to the red "RESTRICTED" badge on the result card
- Point to "No Access" indicator

> "Clearly marked: RESTRICTED sensitivity, No Access for this role. James can see it exists but can't query it."

---

### AC-2.4: The Business User selects the data product and can view: business description, sensitivity classification, applicable access policies, Data Owner and Steward information
**[REACT APP — Dataset Detail]** (5 min)

**Actions:**
- Click into BUSINESS_ENTITY_REVENUE_TRANSACTIONS
- **Show Overview tab:**
  - Business description: "Business entity revenue transactions for Ontario tax administration..."
  - Sensitivity: RESTRICTED badge
  - Data Owner: David Park
  - Data Steward: Angela Rossi
- **Click Policies tab:**
  - Table Sensitivity: RESTRICTED
  - Access Control: Owner Approval Required
  - Masking Policy: Tag-based dynamic masking (4 columns: ENTITY_NAME, BN_NUMBER, REVENUE_AMOUNT, TAX_COLLECTED)
  - Approval Routing: David Park (Data Owner)
  - Governance Framework: OPS Enterprise Data Governance Policy v2.1

> "Full transparency before James even requests. He sees exactly: what the data is, how sensitive it is, what policies apply, who approves, and which columns will be masked."

---

### AC-2.5: The Business User initiates an access request directly from the marketplace
**[REACT APP — Request Access Button]** (2 min)

**Actions:**
- Click "Request Access" button
- Show toast notification: "Access request submitted for Business Entity Revenue Transactions. Routed to David Park for approval."

---

### AC-2.6: The system automatically evaluates policy conditions (e.g. role, purpose, data sensitivity)
**[Explain during/after request]** (2 min)

> "Behind that button, the SUBMIT_ACCESS_REQUEST procedure evaluated:
> - Role: OPS_GENERAL_USER — eligible to request
> - Sensitivity: RESTRICTED — requires owner approval
> - Routing: David Park (from the DATA_OWNER tag on the table)
> - Policy: Owner Approval Required
>
> This evaluation is automatic — driven entirely by tags."

---

### AC-2.7: The request is routed to the appropriate approver(s) based on policy
**[STREAMLIT — Access Requests Tab]** (3 min)

> "Now I switch to the Governance Console where David Park reviews incoming requests."

**Actions:**
- Show the pending request from James Wilson
- Show metrics bar: Total / Pending / Approved / Rejected
- Expand the request:
  - WHO: James Wilson (OPS_GENERAL_USER)
  - WHAT: FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS
  - WHY: "Cross-ministry affordability analysis per DM directive Q3-2026..."
  - SENSITIVITY: RESTRICTED
  - ROUTED TO: David Park
  - POLICY: Owner Approval Required

> "Routed based on policy. The DATA_OWNER tag determined the approver — not a static workflow configuration."

---

### AC-2.8: Approvers receive the request and can approve or reject it within the platform
**[STREAMLIT — Approve Button]** (3 min)

**Actions:**
- Click "Approve"
- Show success: "Access GRANTED to OPS_GENERAL_USER"
- Show balloons

> "One click. The PROVISION_ACCESS procedure executed: `GRANT SELECT ON TABLE FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS TO ROLE OPS_GENERAL_USER`. Live immediately."

---

### AC-2.9: Upon approval, the system automatically provides access to the data for the Business User
**[STREAMLIT — Access Verification]** (3 min)

**Actions:**
- Click "Access Verification" section
- Select OPS_GENERAL_USER
- Click "Show Current Grants"
- Point to the new TABLE grant

**[SNOWSIGHT]**
```sql
SHOW GRANTS TO ROLE OPS_GENERAL_USER;
-- New: SELECT on FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS
```

> "Grant is real. No sync delay, no ticket queue. Access is live."

---

### AC-2.10: The Business User receives a notification that access has been granted, and the dataset is ready for use
**[REACT APP — Return as General User]** (3 min)

**Actions:**
- Switch back to React app (General User persona)
- Navigate to BUSINESS_ENTITY_REVENUE_TRANSACTIONS
- Show: badge now says "Access Granted" (green)
- Show toast notification (simulated): "Access to Business Entity Revenue Transactions has been granted. Dataset is ready for use."

> "James sees the status change immediately. No email needed, no portal refresh lag. The access badge updates because the underlying GRANT is live in Snowflake."

---

### [COMMON CRITERIA: Policy-as-Code]
> "The entire routing — from request to approval to provisioning — was driven by two tags: SENSITIVITY and DATA_OWNER. Change the owner tag, routing changes. Change the sensitivity, the approval threshold changes. That's policy-as-code."

---
---

## DEMONSTRATION STORY 3: Contributor Publishes and Manages a Data Product Lifecycle (30 min) — 10 Points

### Context
> "Robert, a Contributor from Education, wants to publish Student Achievement Indicators to the marketplace."

---

### AC-3.1: The Contributor accesses a producer or publisher view of the Data Marketplace
**[REACT APP — /publish page]** (2 min)

**Actions:**
- Navigate to /publish (Publisher Portal)
- Show the publisher interface: dataset selector, metadata editor, validation panel

> "This is the publisher view — where contributors prepare and publish data products."

---

### AC-3.2: Demonstrate Data product quality/trust scoring
**[REACT APP — Publish Page, Status Panel]** (3 min)

**Actions:**
- Select EDU.STUDENT_ACHIEVEMENT_INDICATORS
- Show quality score: Trust Score 72/100 in the status sidebar
- Show governance checklist: quality threshold indicator (red — below 80)

**[STREAMLIT — Data Quality Tab]**

- Show DMF results for the table
- Show quality scorecard with null counts, duplicate counts

> "Trust scoring is powered by Data Metric Functions — native Snowflake objects that run on a schedule and measure completeness, uniqueness, and freshness. Score: 72/100 — below our 80 threshold."

---

### AC-3.3: Demonstrate automated contract validation before publishing
**[REACT APP — Run Validation]** (4 min)

**Actions:**
- Click "Run Pre-Publish Validation"
- Show 7 automated checks:
  1. Certification Set: FAIL (currently Draft)
  2. Data Owner Assigned: PASS (Jennifer Wu)
  3. All Columns Documented: PASS (17 columns)
  4. Sensitivity Classified: PASS
  5. Quality Above Threshold (80+): FAIL (72/100)
  6. Description Provided: PASS
  7. Delivery Methods Defined: PASS

> "Automated contract validation — 7 governance prerequisites checked before publication is allowed. Two failures: certification is still Draft, and quality is below threshold. The system blocks publication until these are resolved."

---

### AC-3.4: The Contributor selects an existing governed dataset to publish as a data product
**[Already done — dataset selector]** (1 min)

> "We selected the existing governed dataset from the dropdown. Let me switch to one that will pass validation."

**Actions:**
- Switch to MOH.ER_WAIT_TIME_ANALYTICS (Trust Score: 91, Certification: Authoritative)

---

### AC-3.5: The Contributor can define or edit: business description, certification level, intended audience, tags, delivery methods
**[REACT APP — Metadata Editor]** (5 min)

**Actions:**
- **Edit description:** Show the textarea, add a sentence about intended use
- **Set certification:** Change dropdown to "Authoritative"
- **Set intended audience:** Type "All OPS Health Analysts, Performance Teams"
- **Edit tags:** Remove a tag (click X), add a new tag ("performance-metrics")
- **Set delivery methods:** Toggle TABLE and API buttons on

> "Full metadata control: business description, certification level, intended audience, tags, and delivery methods. All editable by the contributor before publication."

---

### AC-3.6: The system validates that required governance prerequisites (ownership, classification, policies) are met
**[REACT APP — Run Validation on MOH dataset]** (3 min)

**Actions:**
- Click "Run Pre-Publish Validation"
- Show all 7 checks passing (green checkmarks)

> "All governance prerequisites met: owner assigned, classified, policies attached, quality above threshold, description provided, delivery defined. The contract is satisfied."

---

### AC-3.7: The Contributor submits the data product for publication
**[REACT APP — Publish Button]** (2 min)

**Actions:**
- Click "Publish to Marketplace"
- Show success: "Published! Data product is now live with certification: Authoritative"

---

### AC-3.8: The dataset becomes discoverable in the marketplace according to its certification and visibility scope
**[REACT APP — Return to Marketplace]** (2 min)

**Actions:**
- Navigate to homepage
- Show the dataset with its Authoritative badge
- Filter by "Authoritative" — it appears

> "Published and immediately discoverable with the Authoritative badge. Consumers can now find, view, and request access based on their role."

---

### AC-3.9: Marketplace consumers can view the product with all associated metadata and trust indicators
**[REACT APP — Click into dataset]** (2 min)

**Actions:**
- Click into the published dataset
- Show: full metadata, quality scores, lineage, trust score, delivery methods

> "Everything the contributor defined is visible to consumers: description, certification, quality trust score, schema, lineage, delivery methods."

---

### AC-3.10: The Contributor can later update metadata, deprecate the product, or publish a new version
**[REACT APP — Publisher Actions Panel]** (4 min)

**Actions:**
- Return to /publish
- Show "Deprecate Product" button — click it
- Show: lifecycle status changes to "Deprecated", certification resets to Draft
- Show "Create New Version" button

> "Full lifecycle management: update metadata anytime, deprecate when the data is superseded, or create a new version. Each action is auditable via tag history."

**[SNOWSIGHT — verify tag history]**
```sql
SELECT * FROM SNOWFLAKE.ACCOUNT_USAGE.TAG_REFERENCES
WHERE OBJECT_DATABASE = 'ON_GOVERNANCE_RFS'
  AND TAG_NAME = 'CERTIFICATION'
ORDER BY TAG_VALUE;
```

---

### [COMMON CRITERIA: Usage Tracking]
> "The publisher sees usage metrics in the status panel — how many queries per week, how many unique users. This helps contributors understand adoption and make deprecation decisions."

### [COMMON CRITERIA: Cross-Domain Composition]
> "This dataset now joins the marketplace alongside MCCSS and LABOUR products. Cross-domain: a Data Scientist can combine Education achievement with Health outcomes in one governed query."

---
---

## DEMONSTRATION STORY 4: Data Scientist Acquires AI-Ready Data via API or Feature Delivery (30 min) — 10 Points

### Context
> "Dr. Alex Kim, a Data Scientist, wants to discover AI-Ready datasets, review feature-level metadata, and consume data programmatically for model development."

---

### AC-4.1: The Data Marketplace homepage is presented
**[REACT APP — Homepage]** (1 min)

**Actions:**
- Show marketplace (already open)
- Switch persona to "Data Scientist"

---

### AC-4.2: The Data Scientist filters marketplace results by "AI-Ready" or "ML-Enabled" certification
**[REACT APP — AI-Ready Filter]** (2 min)

**Actions:**
- Click "AI-Ready" filter pill
- Show filtered results: Patient Outcome Features, Workforce Development Features, Client Retention, Customer Demographics, Energy Grid

> "Five AI-Ready datasets across four ministries — pre-validated for ML use cases."

---

### AC-4.3: The Data Scientist selects a dataset and can view: feature descriptions and schemas, data freshness and update frequency, quality metrics relevant to ML, lineage and source systems
**[REACT APP — ML Delivery Page]** (8 min)

**Actions:**
- Navigate to /ml-delivery
- Select "Patient Outcome Features"

**Feature descriptions and schemas:**
- Show feature metadata table with columns, types, descriptions
- Point to PREV_HOSPITALIZATIONS (importance 10/10), COMORBIDITY_INDEX (9/10), AGE (8/10)

**Data freshness and update frequency:**
- Show: Update frequency "Weekly", last updated date
- Show: Row count (80,000)

**Quality metrics relevant to ML:**
- Show: Trust Score 96/100, IS_TRAINING_SUITABLE flag, DATA_QUALITY_SCORE column
- Show: feature importance rankings

**Lineage and source systems:**
- Navigate to dataset detail → Lineage tab
- Show DAG: Ontario Health Data Platform + CIHI + Drug Benefit Claims → Feature Engineering → Patient Outcome Features → Readmission Model + Population Health + OHT Dashboard

> "Complete ML context: features ranked by importance, quality scored for training suitability, freshness tracked, lineage from source through engineering to downstream models."

---

### AC-4.4: The Data Scientist selects a delivery option such as: API access, Feature table, Scheduled dataset refresh
**[REACT APP — ML Delivery Page → Delivery Methods]** (5 min)

**Actions:**
- Click "FEATURE_TABLE" — show SQL access snippet
- Click "API" — show Python Snowpark SDK code + REST API curl command
- Click "Scheduled Refresh" — show cron schedule config + Task-based refresh SQL

> "Three delivery options, each with ready-to-use code. Feature Table for direct SQL, API for programmatic access, Scheduled Refresh for recurring pipeline integration."

---

### AC-4.5: The Data Scientist initiates access or provisioning from the marketplace
**[REACT APP — Back to marketplace, add to basket]** (2 min)

**Actions:**
- Return to marketplace
- Add Patient Outcome Features to basket
- Show basket with policy evaluation

---

### AC-4.6: The system validates policy eligibility and provisioning requirements
**[REACT APP — Basket Policy Evaluation]** (2 min)

**Actions:**
- Show basket sidebar policy evaluation:
  - Role: OPS_DATA_SCIENTIST
  - Sensitivity: RESTRICTED — requires approval
  - Routed to: Dr. Rajesh Patel

> "Policy validated: Data Scientist role is eligible, but RESTRICTED sensitivity requires owner approval."

---

### AC-4.7: Upon approval (if required), the dataset or features are automatically made available programmatically
**[STREAMLIT — Quick Approve]** (3 min)

**Actions:**
- Switch to Governance Console
- Approve the pending request
- Switch back to React app — show access granted

> "Approved. The GRANT executes immediately. Alex can now use any delivery method — SQL, API, SDK — all governed by the same policies."

---

### AC-4.8: Exposure of AI-relevant metadata (labels, features, training suitability)
**[REACT APP — ML Delivery Page]** (2 min)

**Actions:**
- Return to ML Delivery page
- Point to:
  - Feature importance rankings (1-10 per column)
  - IS_TRAINING_SUITABLE column (Yes/No per row)
  - DATA_QUALITY_SCORE (0-100 per row)
  - UPDATE_FREQUENCY metadata

> "AI-relevant metadata exposed at every level: dataset level (AI-Ready tag, trust score), feature level (importance ranking), and row level (training suitability, quality score)."

---

### AC-4.9: The Data Scientist receives connection details or credentials needed for direct integration into their ML environment
**[REACT APP — Connection Details Panel]** (3 min)

**Actions:**
- Click "Show" on Connection Details
- Show:
  - Account: sfsenorthamerica-mbijelic-aws-useast1
  - Host: ...snowflakecomputing.com
  - Database: ON_GOVERNANCE_RFS
  - Schema: MOH
  - Warehouse: COMPUTE_WH
  - Role: OPS_DATA_SCIENTIST
  - Authentication: SSO (Entra ID SAML)
  - JDBC URL: full connection string

> "Complete connection details for direct integration: account, host, database, schema, warehouse, role, auth method, and a ready-to-use JDBC URL. Alex copies this into their ML pipeline config — Jupyter, Databricks, SageMaker, whatever environment they use."

**[SNOWSIGHT — Live demo]**
```sql
USE ROLE OPS_DATA_SCIENTIST;
SELECT PATIENT_ID, AGE, CHRONIC_CONDITIONS_COUNT, READMISSION_RISK_SCORE,
       COMORBIDITY_INDEX, DATA_QUALITY_SCORE
FROM ON_GOVERNANCE_RFS.MOH.PATIENT_OUTCOME_FEATURES
WHERE IS_TRAINING_SUITABLE = 'Yes' AND DATA_QUALITY_SCORE >= 90
LIMIT 10;
-- PATIENT_ID is masked (RESTRICTED), feature columns are visible
```

> "Masking follows the data. PATIENT_ID is masked because it's tagged RESTRICTED. Feature columns are accessible. Same policy, same result, regardless of delivery method."

---

### [COMMON CRITERIA: Cross-Domain Composition]
**[SNOWSIGHT]** (2 min)
```sql
-- Cross-domain ML: combine MOH + LABOUR features
SELECT p.AGE, p.CHRONIC_CONDITIONS_COUNT, p.READMISSION_RISK_SCORE,
       w.TRAINING_HOURS, w.SKILL_MATCH_SCORE, w.EMPLOYMENT_OUTCOME
FROM ON_GOVERNANCE_RFS.MOH.PATIENT_OUTCOME_FEATURES p
JOIN ON_GOVERNANCE_RFS.LABOUR.WORKFORCE_DEVELOPMENT_FEATURES w
  ON p.AGE = w.AGE AND p.GENDER = w.GENDER
WHERE p.IS_TRAINING_SUITABLE = 'Yes'
LIMIT 20;
```

> "Cross-domain feature composition: Health outcomes + Workforce development in one query. Two ministries, one governed platform."

---
---

## Common Criteria Recap (5 minutes) — 40 Points

> "Let me explicitly summarize the three common criteria demonstrated across all four stories:"

### 1. Usage Tracking and Adoption Metrics
> "Every story showed live usage data: 142 queries/week on Client Retention, 180 on ER Wait Times, unique user counts, trending indicators. The Usage Dashboard aggregates this from QUERY_HISTORY. This is how OPS measures adoption — not by self-reporting, but by actual consumption patterns."

**Actions:**
- Quick show /usage page: ranking table, cross-domain JOINs

### 2. Cross-Domain Data Product Composition
> "Story 1: MCCSS retention + demographics in one basket. Story 3: Education published alongside Health. Story 4: MOH + LABOUR features in one ML query. The platform enables cross-domain composition by design — same governance, same namespace, zero data movement."

### 3. Policy-as-Code Automation
> "Every story demonstrated tag-driven automation:
> - Set SENSITIVITY=RESTRICTED → masking policy auto-applies (no per-column config)
> - Set DATA_OWNER=X → access requests route to X (no workflow config)
> - Set CERTIFICATION=Authoritative → appears in marketplace with badge (no publishing config)
> - Set AI_READY=TRUE → visible to Data Scientists (no role mapping)
>
> One tag change → cascading governance effects. That's policy-as-code at platform scale."

---

## Closing (2 minutes)

> "Four scenarios, one platform. Discovery, access control, classification, quality, publishing, ML delivery — all built in, not bolted on. This is Snowflake Horizon."

---
---

## Q&A Backup Topics

| Question | Answer |
|----------|--------|
| Databricks integration | Iceberg REST Catalog protocol — reads Unity Catalog natively, open standard |
| OpenLineage | ACCESS_HISTORY → OpenLineage JSON mapping, format transformation only |
| 99.99% SLA | Business Critical edition, multi-AZ, contractual |
| Canadian data residency | ca-central-1 (Montreal), all compute + AI inference in-region |
| Pricing | Consumption model, all Horizon features included in Enterprise Edition |
| Entra ID | SCIM provisioning + SAML SSO, immediate provisioning/revocation |
| Scale to 8,000-10,000 | Catalog handles millions of objects, Cortex Search auto-indexes |
| Concurrent users | 30 stewards + 100 read users within standard operating parameters |
