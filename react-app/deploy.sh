#!/bin/bash
# ============================================================
# OPS Data Marketplace — React SPCS App Deploy
# ============================================================
# Prerequisites:
#   - Docker installed and running
#   - Authenticated to Snowflake registry: docker login <account>.registry.snowflakecomputing.com
#   - SPCS compute pool and image repository exist
# ============================================================

set -e

# ---- CONFIGURATION (edit these for your account) ----
ACCOUNT="sfsenorthamerica-mbijelic-aws-useast1"
DB="ON_GOVERNANCE_RFS"
SCHEMA="PUBLIC"
REPO="DEMO_REPO"
SERVICE="OPS_MARKETPLACE_SERVICE"
POOL="MARKETPLACE_POOL"
VERSION="v1"
REGISTRY="${ACCOUNT}.registry.snowflakecomputing.com"
IMAGE_PATH="${REGISTRY}/${DB}/${SCHEMA}/${REPO}/ops-marketplace:${VERSION}"
# ---- END CONFIGURATION ----

echo "=== OPS Marketplace SPCS Deploy ==="
echo "Account: ${ACCOUNT}"
echo "Image:   ${IMAGE_PATH}"
echo ""

# Build
echo "[1/3] Building Docker image..."
docker build --platform linux/amd64 -t ops-marketplace:${VERSION} .

# Tag
echo "[2/3] Tagging for Snowflake registry..."
docker tag ops-marketplace:${VERSION} ${IMAGE_PATH}

# Push
echo "[3/3] Pushing to Snowflake registry..."
docker push ${IMAGE_PATH}

echo ""
echo "=== Push complete! ==="
echo ""
echo "Now run the following SQL in Snowsight to create/update the service:"
echo ""
cat <<'EOSQL'
-- Create image repository (if not exists)
CREATE IMAGE REPOSITORY IF NOT EXISTS ON_GOVERNANCE_RFS.PUBLIC.DEMO_REPO;

-- Create compute pool (if not exists)
CREATE COMPUTE POOL IF NOT EXISTS MARKETPLACE_POOL
  MIN_NODES = 1 MAX_NODES = 1
  INSTANCE_FAMILY = CPU_X64_XS;

-- Create or replace the service
CREATE SERVICE IF NOT EXISTS ON_GOVERNANCE_RFS.PUBLIC.OPS_MARKETPLACE_SERVICE
  IN COMPUTE POOL MARKETPLACE_POOL
  FROM SPECIFICATION $$
  spec:
    containers:
    - name: app
      image: /ON_GOVERNANCE_RFS/PUBLIC/DEMO_REPO/ops-marketplace:v1
      env:
        SNOWFLAKE_ACCOUNT: sfsenorthamerica-mbijelic-aws-useast1
        SNOWFLAKE_WAREHOUSE: COMPUTE_WH
      readinessProbe:
        port: 8080
        path: /
    endpoints:
    - name: app
      port: 8080
      public: true
  $$;

-- Or update existing service:
-- ALTER SERVICE ON_GOVERNANCE_RFS.PUBLIC.OPS_MARKETPLACE_SERVICE
--   FROM SPECIFICATION $$ ... $$;

-- Check status:
-- SELECT SYSTEM$GET_SERVICE_STATUS('ON_GOVERNANCE_RFS.PUBLIC.OPS_MARKETPLACE_SERVICE');

-- Get endpoint URL:
-- SHOW ENDPOINTS IN SERVICE ON_GOVERNANCE_RFS.PUBLIC.OPS_MARKETPLACE_SERVICE;
EOSQL
