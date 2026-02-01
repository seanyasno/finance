#!/bin/bash

# Swift models generation from OpenAPI spec
# Generates only models (not full API client) for use with existing APIService

set -e

API_URL="http://localhost:3100/api-json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
OUTPUT_DIR="$PROJECT_ROOT/apps/finance/finance/Generated"
TEMP_DIR="/tmp/swift-gen-$$"
TEMP_SPEC="$TEMP_DIR/openapi-spec.json"

echo "🔍 Checking API server..."

# Health check
if ! curl -s -f "$API_URL" > /dev/null 2>&1; then
    echo "❌ Error: API server is not running at $API_URL"
    echo "Please start it: cd apps/api && npm run dev"
    exit 1
fi

echo "✅ API server is running"

# Create temp directory
mkdir -p "$TEMP_DIR"

# Download OpenAPI spec
echo "📥 Downloading OpenAPI spec..."
curl -s "$API_URL" > "$TEMP_SPEC"

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "🧹 Cleaning previous generated files..."
rm -rf "$OUTPUT_DIR"/*

echo "🔨 Generating Swift models from OpenAPI spec..."

# Generate using OpenAPI Generator (models only)
# Use String for UUIDs instead of Swift UUID type for easier JSON handling
openapi-generator-cli generate \
  -i "$TEMP_SPEC" \
  -g swift5 \
  -o "$TEMP_DIR/generated" \
  --global-property models,supportingFiles \
  --additional-properties=projectName=FinanceAPI,\
useSPMFileStructure=false,\
responseAs=AsyncAwait,\
useJsonEncodable=true,\
swiftUseApiNamespace=false \
  --type-mappings=UUID=String \
  --model-name-suffix=""

# Copy models and ALL supporting files
echo "📦 Copying generated models and supporting files..."
if [ -d "$TEMP_DIR/generated/Sources/FinanceAPI" ]; then
    # Copy all models
    if [ -d "$TEMP_DIR/generated/Sources/FinanceAPI/Models" ]; then
        cp "$TEMP_DIR/generated/Sources/FinanceAPI/Models/"*.swift "$OUTPUT_DIR/" 2>/dev/null || true
    fi

    # Copy ALL supporting Swift files (not just specific ones)
    cp "$TEMP_DIR/generated/Sources/FinanceAPI/"*.swift "$OUTPUT_DIR/" 2>/dev/null || true
fi

# Cleanup
rm -rf "$TEMP_DIR"

echo "✅ Models generated successfully"
echo "📁 Output: $OUTPUT_DIR"
echo ""
echo "✨ Use these models with your existing APIService and service classes"
