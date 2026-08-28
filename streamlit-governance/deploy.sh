#!/bin/bash
# ============================================================
# OPS Governance Console — Streamlit-in-Snowflake Deploy
# ============================================================
# Prerequisites:
#   - snow CLI installed (pip install snowflake-cli)
#   - Authenticated via snow connection
# ============================================================

set -e

echo "=== Deploying Streamlit Governance Console ==="

# Deploy using snow CLI
snow streamlit deploy \
  --database ON_GOVERNANCE_RFS \
  --schema PUBLIC \
  --name GOVERNANCE_CONSOLE \
  --file app.py \
  --replace

echo ""
echo "=== Deploy complete! ==="
echo "Open in Snowsight: Streamlit Apps > GOVERNANCE_CONSOLE"
echo ""
echo "If snow CLI is not available, manually create in Snowsight:"
echo "  1. Go to Streamlit"
echo "  2. Click '+ Streamlit App'"
echo "  3. Name: GOVERNANCE_CONSOLE"
echo "  4. Database: ON_GOVERNANCE_RFS, Schema: PUBLIC"
echo "  5. Warehouse: COMPUTE_WH"
echo "  6. Paste contents of app.py"
