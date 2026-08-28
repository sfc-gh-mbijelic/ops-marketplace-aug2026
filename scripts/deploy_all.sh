#!/bin/bash
# ============================================================
# OPS Data Marketplace — Full Deploy Script
# ============================================================
# Runs all setup SQL scripts in order via SnowSQL or snow CLI.
# Prerequisites: snow CLI authenticated, Docker for SPCS app.
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
SETUP_DIR="${REPO_DIR}/setup"
DATA_DIR="${REPO_DIR}/data"

echo "============================================"
echo " OPS Data Marketplace — Full Deployment"
echo " RFS-SPDP-2026-06 Demo Environment"
echo "============================================"
echo ""

# Check for snow CLI
if ! command -v snow &> /dev/null; then
    echo "ERROR: 'snow' CLI not found. Install with: pip install snowflake-cli"
    exit 1
fi

# Step 1: Run setup SQL scripts
echo "[Step 1/5] Running SQL setup scripts..."
for script in ${SETUP_DIR}/01_*.sql ${SETUP_DIR}/02_*.sql; do
    echo "  Running: $(basename $script)"
    snow sql -f "$script" 2>&1 | tail -1
done

# Step 2: Upload data files
echo ""
echo "[Step 2/5] Uploading data CSVs to stage..."
snow sql -q "USE DATABASE ON_GOVERNANCE_RFS; USE SCHEMA PUBLIC;" 2>/dev/null

for csv in ${DATA_DIR}/*.csv; do
    filename=$(basename "$csv")
    # Determine target subfolder from filename prefix
    case "$filename" in
        mccss_*) folder="mccss" ;;
        fin_*)   folder="fin" ;;
        moh_*)   folder="moh" ;;
        edu_*)   folder="edu" ;;
        mto_*)   folder="mto" ;;
        energy_*) folder="energy" ;;
        labour_*) folder="labour" ;;
        *)       folder="other" ;;
    esac
    echo "  Uploading: ${filename} -> @DATA_STAGE/${folder}/"
    snow sql -q "PUT file://${csv} @ON_GOVERNANCE_RFS.PUBLIC.DATA_STAGE/${folder}/ AUTO_COMPRESS=FALSE OVERWRITE=TRUE;" 2>&1 | tail -1
done

# Step 3: Run remaining setup scripts
echo ""
echo "[Step 3/5] Running remaining SQL scripts (03-11)..."
for script in ${SETUP_DIR}/03_*.sql ${SETUP_DIR}/04_*.sql ${SETUP_DIR}/05_*.sql \
              ${SETUP_DIR}/06_*.sql ${SETUP_DIR}/07_*.sql ${SETUP_DIR}/08_*.sql \
              ${SETUP_DIR}/09_*.sql ${SETUP_DIR}/10_*.sql ${SETUP_DIR}/11_*.sql; do
    echo "  Running: $(basename $script)"
    snow sql -f "$script" 2>&1 | tail -1
done

# Step 4: Deploy Streamlit
echo ""
echo "[Step 4/5] Deploying Streamlit Governance Console..."
cd "${REPO_DIR}/streamlit-governance"
bash deploy.sh

# Step 5: Deploy React app (if Docker available)
echo ""
echo "[Step 5/5] SPCS React App..."
if command -v docker &> /dev/null; then
    echo "  Docker found. Run 'cd react-app && bash deploy.sh' to build and push."
    echo "  (Skipping automatic build — requires registry login)"
else
    echo "  Docker not found. Skip SPCS deploy."
    echo "  The demo works fully with Streamlit + Internal Marketplace."
fi

echo ""
echo "============================================"
echo " Deployment Complete!"
echo "============================================"
echo ""
echo "Next steps:"
echo "  1. Set up Internal Marketplace Provider Profile in Snowsight"
echo "  2. Run validation: snow sql -f scripts/validate_setup.sql"
echo "  3. Open DEMO_SCRIPT.md and run through the demo"
echo ""
