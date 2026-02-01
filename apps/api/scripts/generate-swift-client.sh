#!/bin/bash

# Swift API client generation from OpenAPI spec
# Generates full API client with models and methods for iOS app

set -e

API_URL="http://localhost:3100/api-json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/apps/finance/finance/Generated"
TEMP_SPEC="/tmp/openapi-spec.json"

echo "🔍 Checking API server..."

# Health check - verify API is running
if ! curl -s -f "$API_URL" > /dev/null 2>&1; then
    echo "❌ Error: API server is not running or not accessible at $API_URL"
    echo ""
    echo "Please start the API server first:"
    echo "  cd apps/api && npm run dev"
    echo ""
    exit 1
fi

echo "✅ API server is running"

# Download OpenAPI spec
echo "📥 Downloading OpenAPI spec..."
curl -s "$API_URL" > "$TEMP_SPEC"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🧹 Cleaning previous generated files..."
rm -rf "$OUTPUT_DIR"/*

echo "🔨 Generating Swift API client..."

# Generate Swift client using OpenAPI Generator
openapi-generator-cli generate \
  -i "$TEMP_SPEC" \
  -g swift5 \
  -o "$OUTPUT_DIR" \
  --additional-properties=projectName=FinanceAPI,\
useSPMFileStructure=false,\
responseAs=AsyncAwait,\
useJsonEncodable=false,\
swiftUseApiNamespace=true

echo "✅ Swift API client generated successfully"
echo "📁 Output: $OUTPUT_DIR"
echo ""
echo "✨ Generated files include:"
echo "   - Models/ - All data models from API"
echo "   - APIs/ - API client methods (AuthAPI, CategoriesAPI, etc.)"
echo "   - OpenAPIClient/ - Core client infrastructure"

# Cleanup
rm -f "$TEMP_SPEC"
