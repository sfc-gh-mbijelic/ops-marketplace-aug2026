#!/bin/bash
# ============================================================
# Reset Demo State (between demo runs)
# ============================================================
# Clears access requests, re-seeds sample data, resets grants.
# Run this before each demo to start fresh.
# ============================================================

set -e

echo "=== Resetting OPS Demo State ==="

snow sql -q "
-- Clear access requests and re-seed
TRUNCATE TABLE ON_GOVERNANCE_RFS.PUBLIC.ACCESS_REQUESTS;
TRUNCATE TABLE ON_GOVERNANCE_RFS.PUBLIC.CLASSIFICATION_AUDIT;

-- Revoke grants that were given during demo
REVOKE SELECT ON TABLE ON_GOVERNANCE_RFS.FIN.BUSINESS_ENTITY_REVENUE_TRANSACTIONS FROM ROLE OPS_GENERAL_USER;
REVOKE SELECT ON TABLE ON_GOVERNANCE_RFS.MCCSS.CUSTOMER_DEMOGRAPHICS FROM ROLE OPS_GENERAL_USER;
"

echo "  Cleared access requests and classification audit"
echo "  Revoked demo grants"

# Re-run sample requests
echo "  Re-seeding sample requests..."
snow sql -f "$(dirname "$0")/../setup/11_sample_requests.sql" 2>&1 | tail -1

echo ""
echo "=== Demo state reset complete! ==="
echo "Ready for a fresh demo run."
