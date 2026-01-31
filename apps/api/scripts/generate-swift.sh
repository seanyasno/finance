#!/bin/bash

# Swift code generation from OpenAPI spec
# Generates Swift 5 models for iOS app from running API server

set -e

API_URL="http://localhost:3100/api-json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/apps/finance/finance/Generated"

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

# Create output directory if needed
mkdir -p "$OUTPUT_DIR"

echo "🧹 Cleaning previous generated files..."
rm -rf "$OUTPUT_DIR"/*

echo "🔄 Generating Swift models from OpenAPI spec..."

# Generate Swift models using openapi-generator-cli
# Configuration:
#   - swift5: Swift 5 language target
#   - library=urlsession: Use URLSession for networking (standard iOS approach)
#   - modelPackage=Generated: Package name for generated models
#   - --global-property models: Generate only model files (no API client)

npx @openapitools/openapi-generator-cli generate \
    -i "$API_URL" \
    -g swift5 \
    -o "$OUTPUT_DIR" \
    --global-property models \
    --additional-properties=library=urlsession,modelPackage=Generated

echo "✅ Swift models generated successfully"
echo "📁 Output: apps/finance/finance/Generated/"
echo ""
echo "Next steps:"
echo "  1. Open apps/finance/finance.xcodeproj in Xcode"
echo "  2. Add Generated folder to project if not already added"
echo "  3. Update imports to use generated types"
