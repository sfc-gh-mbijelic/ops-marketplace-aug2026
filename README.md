# OPS Data Marketplace Demo — RFS-SPDP-2026-06

Self-contained demo for the Ontario Public Service Data Marketplace RFP (Stage 2 Live Demonstration, 80 points).

## Architecture

```
Internal Marketplace (native)  ←→  SPCS React App (consumer gaps)  ←→  Streamlit (governance admin)
         ↓                                    ↓                                    ↓
    Discovery/Access                  Basket, Lineage, ML Delivery         Approvals, Classification,
    Native search/filter              AI Recommendations, Usage            Quality, Publishing
         ↓                                    ↓                                    ↓
    ┌─────────────────────────── Snowflake Governance Layer ───────────────────────────┐
    │  Tags  │  Tag-Based Masking  │  DMFs  │  SYSTEM$CLASSIFY  │  ACCESS_HISTORY     │
    └─────────────────────────────────────────────────────────────────────────────────────┘
```

## Prerequisites

- Snowflake Enterprise+ account (required for Horizon governance features)
- ACCOUNTADMIN role access
- Docker (for SPCS React app deploy)
- snow CLI (for Streamlit deploy): `pip install snowflake-cli`

## Quick Start

```bash
# 1. Generate sample data (already pre-generated in data/)
python scripts/generate_data.py

# 2. Deploy everything
chmod +x scripts/deploy_all.sh
./scripts/deploy_all.sh

# 3. Validate
snow sql -f scripts/validate_setup.sql

# 4. Reset between demo runs
./scripts/reset_demo.sh
```

## Manual Setup (if deploy_all.sh doesn't fit your workflow)

1. Run SQL scripts in order: `setup/01_*.sql` through `setup/11_*.sql`
2. Upload CSVs to stage (or use Snowsight "Load Data" UI)
3. Deploy Streamlit: paste `streamlit-governance/app.py` into a new Streamlit app
4. Deploy React (optional): `cd react-app && bash deploy.sh`
5. Set up Internal Marketplace Provider Profile in Snowsight

## Demo Stories → Snowflake Features

| RFP Story | Native Feature | Demo Surface |
|-----------|---------------|--------------|
| 1: Discovery & Access | Internal Marketplace, Cortex Search, Tags | Marketplace + React |
| 2: Restricted Data Approval | Tag-based masking, Access requests, Stored procs | React + Streamlit |
| 3: Publish & Lifecycle | DMFs, SYSTEM$CLASSIFY, Tags, Validation proc | Streamlit + Snowsight |
| 4: AI-Ready / API Delivery | Feature tables, SQL API, Snowpark SDK | React ML page + Snowsight |
| Common: Usage tracking | QUERY_HISTORY, ACCESS_HISTORY | React usage page |
| Common: Cross-domain composition | JOIN patterns across ministry schemas | Usage dashboard |
| Common: Policy-as-code | Tag-based masking auto-propagation | All stories |

## File Structure

```
ops-marketplace-aug2026/
├── data/                    # 9 pre-generated CSVs (~1MB total)
├── setup/                   # 11 numbered SQL scripts (idempotent)
├── react-app/               # Next.js SPCS app (marketplace UI)
├── streamlit-governance/    # Streamlit-in-Snowflake (admin console)
├── scripts/                 # deploy_all.sh, reset_demo.sh, validate, generate_data.py
├── DEMO_SCRIPT.md           # 150-minute walkthrough with speaker notes
└── README.md                # This file
```

## Key Differentiators to Emphasize

1. **Governance executes at query time** — not via external proxy or middleware
2. **Policy-as-code via tags** — set a SENSITIVITY tag, masking auto-applies across all tables
3. **AI classification in-region** — SYSTEM$CLASSIFY runs in Canadian data center
4. **Zero-copy data sharing** — Internal Marketplace, no data movement
5. **Single platform** — no integration tax between catalog, access, quality, and lineage

## Configuration

All account-specific values are in deploy scripts. Key variables to update for a different account:
- `react-app/deploy.sh`: ACCOUNT, DB, SCHEMA, REPO, SERVICE, POOL
- `setup/06_roles_and_grants.sql`: `GRANT ROLE ... TO USER MBIJELIC` (change username)
