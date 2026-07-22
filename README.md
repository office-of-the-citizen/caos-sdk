# CAOS SDK

Official SDK for communicating with the Constitutional Artificial Operating System (CAOS).

> **Documentation site:** a full, self-contained reference lives in
> [`docs/index.html`](docs/index.html) — principles, installation, quickstart,
> the complete API surface, the permanent-snapshot ownership chain, the error
> model and the compatibility gate, styled as constitutional infrastructure.
> Open it directly or serve the `docs/` folder statically.

## Installation

### From GitHub Packages

First, configure npm to use the GitHub Packages registry for the `@office-of-the-citizen` scope:

```bash
# Create or edit .npmrc in your project root
echo "@office-of-the-citizen:registry=https://npm.pkg.github.com" > .npmrc
```

Then install:

```bash
npm install @office-of-the-citizen/caos-sdk
```

### Authentication

GitHub Packages requires authentication. Create a Personal Access Token (PAT) at https://github.com/settings/tokens with the `read:packages` scope.

**Option A: .npmrc with token (recommended for projects)**

```bash
# In your project's .npmrc
@office-of-the-citizen:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=ghp_your_token_here
```

**Option B: npm login**

```bash
npm login --registry=https://npm.pkg.github.com
# Enter your GitHub username and PAT when prompted
```

**Option C: Environment variable (recommended for CI)**

```bash
NODE_AUTH_TOKEN=ghp_your_token_here npm install @office-of-the-citizen/caos-sdk
```

## Quick Start

```typescript
import {
  CaosClient,
  getBySlug,
  breadcrumb,
  lgaNavigationTree,
  getPermanentSnapshotMeta,
} from "@office-of-the-citizen/caos-sdk";

// Permanent geography — distributed Engine 10 snapshot (no network).
// CAOS owns the data; the SDK only distributes the published projection.
const lga = getBySlug("lg-la-ikeja");
const chain = lga ? breadcrumb(lga.canonical_id) : [];
const tree = lgaNavigationTree();
const meta = getPermanentSnapshotMeta(); // epoch, commit, content_hash, generated_at

// Live constitutional truth — requires Engine 12 gateway.
const client = new CaosClient("https://your-caos-instance.com", {
  apiKey: "your-api-key",
});
const record = await client.getPublicRecord("lg-la-ikeja");
const results = await client.searchPublicRecords("healthcare", { limit: 10 });

// Authentication / Workroom
const session = await client.login("your-api-key");
const me = await client.me();
const items = await client.listDecisionItems("OPEN");
await client.resolveDecisionItem(42, "APPROVED", "Reviewed and approved");
```

Applications compose their own view models from permanent snapshot + truth.
The SDK does not ship presentation defaults or compose helpers.
Population never appears in the permanent snapshot.

## Authentication

The SDK supports two authentication methods:

```typescript
// API Key authentication
const client = new CaosClient(baseUrl, { apiKey: "your-key" });

// Session token authentication (after login)
const session = await client.login(apiKey);
const sessionClient = new CaosClient(baseUrl, {
  sessionToken: session.session_id,
});

// Or swap sessions on an existing client
const refreshed = client.withSession(newToken);
```

## API Reference

### Public Endpoints

| Method | Description |
|--------|-------------|
| `getPublicRecord(slug)` | Fetch a public record by slug |
| `getPublicNavigation()` | Get the navigation index |
| `searchPublicRecords(q, opts)` | Search public records |

### Authentication

| Method | Description |
|--------|-------------|
| `login(apiKey)` | Authenticate and get a session |
| `logout()` | End the current session |
| `me()` | Get current actor info |

### Workroom

| Method | Description |
|--------|-------------|
| `listDecisionItems(status, kind)` | List decision queue items |
| `getDecisionItem(id)` | Get a specific item |
| `resolveDecisionItem(id, decision, note)` | Approve or reject |

### Control Room

| Method | Description |
|--------|-------------|
| `getControlHealth()` | System health status |
| `getControlHealthLayers()` | Layer-level health |
| `getControlWorkers()` | Worker status |
| `issueWorkerCommand(id, cmd, reason)` | Command a worker |
| `getControlPolicy()` | Operational policy |
| `updateControlPolicy(settings, reason)` | Update policy |
| `getControlFailures(opts)` | Query failures |
| `getControlEvents(opts)` | Query events |
| `getControlAi(view)` | AI function status |
| `syncSourceLibrary(reason, dryRun)` | Sync source library |

### Engine 06

| Method | Description |
|--------|-------------|
| `getEnginePlans(params)` | Query compilation plans |
| `getEngineExecutions(params)` | Query executions |
| `getEngineStaleness(params)` | Check staleness |
| `getEngineReviewQueue(params)` | Review queue |
| `resolveEngineReview(id, action, note)` | Resolve review |

### Ledger

| Method | Description |
|--------|-------------|
| `getLedger(limit)` | Fetch ledger records |
| `verifyLedger()` | Verify chain integrity |
| `detectTampering()` | Detect tampering |
| `getLedgerEvent(id)` | Get a specific event |
| `replayLedger()` | Replay ledger |
| `recordLedgerEvent(body)` | Record an event |

### Admission

| Method | Description |
|--------|-------------|
| `admitSources(input, opts)` | Admit source documents |
| `admitSourcesStream(input, onLine)` | Streaming admission (browser) |
| `uploadSource(input)` | Upload a source |

### Governed Claims

| Method | Description |
|--------|-------------|
| `getGovernedClaim(claimId)` | Fetch a governed claim |

## Error Handling

The SDK throws `CaosError` for all API failures:

```typescript
import { CaosClient, CaosError } from "@office-of-the-citizen/caos-sdk";

try {
  await client.getPublicRecord("nonexistent");
} catch (err) {
  if (err instanceof CaosError) {
    console.error(err.code);     // e.g. "HTTP_404"
    console.error(err.message);  // human-readable
    console.error(err.status);   // HTTP status code
    console.error(err.data);     // raw response body
  }
}
```

## TypeScript

Full type definitions are included. All API responses are typed:

```typescript
import type {
  PublicRecord,
  NavigationIndex,
  SearchResponse,
  DecisionItem,
  CaosError,
} from "@office-of-the-citizen/caos-sdk";
```

## Compatibility

- **Node.js** >= 18 (ESM)
- **Next.js** (App Router and Pages Router)
- **Bun**
- **Vite**
- **Any ESM-capable bundler**

The package is ESM-only (`"type": "module"`). CommonJS `require()` is not supported.

## Publishing

### Automatic (CI)

Publishing is handled by GitHub Actions. When a GitHub Release is published, the workflow:

1. Installs dependencies
2. Builds the SDK
3. Verifies package contents with `npm pack --dry-run`
4. Publishes to GitHub Packages

No manual steps required.

### Manual

```bash
# Ensure you are authenticated
npm login --registry=https npm.pkg.github.com

# Build and publish
npm publish
```

### Versioning

`package.json#version` is the **sole source of truth** for the SDK version.
A prebuild step generates `src/generated/runtime-identity.ts` from that field.
Do not hand-edit the generated file.

```bash
# Bump version (updates package.json only)
npm version patch  # or minor / major

# Build embeds the new version into runtime identity
npm run build

# Push tags
git push --follow-tags

# Create a GitHub Release from the tag to trigger CI publish
```

## Local Development

```bash
# Install dependencies
npm install

# Generate runtime identity + build
npm run build

# Type-check (also regenerates identity)
npm run typecheck

# Verify what would be published
npm pack --dry-run
```

## License

MIT — see [LICENSE](./LICENSE).
