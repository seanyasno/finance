# Finance App Configuration

The app's API URL and other settings are managed through `Config.swift`.

## Quick Start

### Option 1: Edit Config.swift Directly (Simplest)

Open `finance/Config/Config.swift` and change the return value:

```swift
static var apiBaseURL: String {
    // Change this line:
    return "http://127.0.0.1:3100"  // ← Your API URL here
}
```

### Option 2: Use Environment Variables (Recommended)

Set environment variables in Xcode schemes for different environments:

1. **In Xcode**: Product → Scheme → Edit Scheme...
2. **Select** "Run" on the left
3. **Go to** "Arguments" tab
4. **Under** "Environment Variables", click **+**
5. **Add**:
   - Name: `API_BASE_URL`
   - Value: `http://127.0.0.1:3100` (or your API URL)

### Option 3: Create Multiple Schemes (Advanced)

For different environments (Dev/Staging/Prod):

1. **Duplicate** the scheme: Product → Scheme → Manage Schemes → ⚙️ → Duplicate
2. **Name it** (e.g., "finance-production")
3. **Set environment variables** for each scheme:
   - `finance-dev`: `API_BASE_URL=http://127.0.0.1:3100`
   - `finance-staging`: `API_BASE_URL=https://staging-api.yourapp.com`
   - `finance-production`: `API_BASE_URL=https://api.yourapp.com`

## Common URLs

```swift
// Local development (Mac)
"http://127.0.0.1:3100"
"http://localhost:3100"

// iOS Simulator accessing Mac's localhost
"http://localhost:3100"

// Real iOS device accessing Mac (use your Mac's IP)
"http://192.168.1.X:3100"  // Replace X with your Mac's IP

// Production
"https://api.yourapp.com"
```

## Finding Your Mac's IP (for testing on real device)

```bash
# macOS
ifconfig | grep "inet " | grep -v 127.0.0.1

# Or
ipconfig getifaddr en0
```

## Verification

On app startup, check the Xcode console for:

```
═══════════════════════════════════════
📱 Finance App Configuration
═══════════════════════════════════════
Version:     1.0 (1)
Environment: DEBUG 🔧
API URL:     http://127.0.0.1:3100
═══════════════════════════════════════
```

This confirms which API URL is being used.

## Troubleshooting

**Problem**: App can't connect to API
- ✅ Verify API URL in startup logs
- ✅ Ensure API server is running: `cd apps/api && npm run dev`
- ✅ For real device: Use Mac's IP, not localhost
- ✅ For real device: Ensure firewall allows connections on port 3100

**Problem**: Environment variable not being used
- ✅ Check it's set in the correct scheme
- ✅ Restart Xcode after changing scheme environment variables
- ✅ Clean build folder: Shift+Cmd+K

## Adding More Configuration

Edit `Config.swift` to add more settings:

```swift
enum Config {
    static var apiBaseURL: String { ... }

    // Add new settings here
    static var enableAnalytics: Bool { ... }
    static var maxRetries: Int { ... }
}
```
