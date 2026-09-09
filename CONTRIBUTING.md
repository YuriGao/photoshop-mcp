# Contributing to Photoshop MCP

Thank you for your interest in contributing! This is a community-maintained project and is not affiliated with or endorsed by Adobe Inc.

## Language policy

This project uses **English** as its canonical language for all project artifacts:

- **Pull request titles, descriptions, and commit messages** must be written in English.
- **Source code, comments, and user-facing UI strings** must be written in English.
- **Documentation** (README, guides, inline docs) must be written in English.

Issues and review comments may be written in any language, but English is preferred so maintainers and future contributors can search and reference them easily.

## Before you start

1. Search [existing issues](https://github.com/alisaitteke/photoshop-mcp/issues) and [pull requests](https://github.com/alisaitteke/photoshop-mcp/pulls) to avoid duplicate work.
2. For large or architectural changes, open an issue first to discuss the approach.
3. For bug fixes and small improvements, a PR without a prior issue is fine.

## Development setup

### Prerequisites

- **Node.js** ≥ 18
- **npm**
- **Adobe Photoshop** installed and scriptable (required only for integration tests)

### Getting started

```bash
git clone https://github.com/alisaitteke/photoshop-mcp.git
cd photoshop-mcp
npm install
npm run build
```

## Releasing

Version bumps ship from **`master`**.

1. Merge feature work to `master`.
2. Bump the `version` field in the root [`package.json`](package.json).
3. Keep [`server.json`](server.json) aligned with `package.json`, then commit:

   ```bash
   npm run sync:server-version
   git add package.json server.json
   git commit -m "X.Y.Z"
   git tag vX.Y.Z
   ```

4. Push the commit and the tag:

   ```bash
   git push origin master
   git push origin vX.Y.Z
   ```

5. Publish to npm and the [Official MCP Registry](https://registry.modelcontextprotocol.io).
   The registry is published with the upstream
   [`mcp-publisher`](https://github.com/modelcontextprotocol/registry) CLI, which is
   not vendored in this repo — install it separately:

   ```bash
   npm publish
   mcp-publisher publish
   ```

Always tag the **release commit on `master`**, not a feature branch.

## Registry listings

### Official MCP Registry

Metadata lives in [`server.json`](server.json). `npm run sync:server-version`
keeps `server.json` aligned with `package.json` before tagging; publish with the
`mcp-publisher` CLI after each npm publish.

### Glama

Listing: [glama.ai/mcp/servers/alisaitteke/photoshop-mcp](https://glama.ai/mcp/servers/alisaitteke/photoshop-mcp)

[`glama.json`](glama.json) at the repo root lets org maintainers claim the server.
After merging changes to `glama.json`, re-run the claim flow on Glama so metadata
syncs.

1. Open the server page → **Claim ownership** (GitHub OAuth).
2. On the **admin** tab, configure the Docker/build spec (Node 20, `npm install`,
   `node dist/index.js` via Glama's `mcp-proxy` wrapper).
3. **Deploy** → wait for the sandbox health check (`initialize` + `tools/list`).
4. **Make Release** with the semver matching the GitHub tag.

Glama releases are independent of GitHub Releases — trigger a new Glama release when
you want the directory grade/security scan refreshed for a shipped version.

### Smithery (MCPB)

Smithery distributes stdio servers as `.mcpb` bundles. Source manifest:
[`mcpb/manifest.json`](mcpb/manifest.json). Build script:
[`scripts/build-mcpb.ts`](scripts/build-mcpb.ts).

```bash
npm run build:mcpb
# → release/photoshop-mcp-<version>.mcpb

npx @smithery/cli auth login
npx @smithery/cli mcp publish "./release/photoshop-mcp-<version>.mcpb" -n alisaitteke/photoshop-mcp
```

`tools_generated` / `prompts_generated` are set because this server exposes a large
dynamic catalog. Rebuild and republish the MCPB after each semver release.

## Project layout

| Path | Purpose |
| --- | --- |
| `src/` | MCP server core, tools, and recipes |
| `scripts/` | Integration and verification test scripts |
| `docs/` | Additional documentation |

See [`docs/architecture.md`](docs/architecture.md) for a detailed breakdown.

## Making changes

1. Branch from `master`.
2. Keep diffs focused — avoid unrelated refactors in the same PR.
3. Follow existing patterns:
   - MCP tools in `src/tools/`
   - Recipe tools in `src/tools/recipes/`
   - Prompt templates in `src/prompts/templates/`

## Code style

- **TypeScript** with strict mode enabled (`tsconfig.json`).
- **ESLint:** `npm run lint`
- **Prettier:** `npm run format:check` (check) or `npm run format` (auto-fix)

Match the style of surrounding code. Prefer extending existing abstractions over introducing parallel patterns.

## Testing

Tests are tiered by whether Photoshop must be running:

### Required (no Photoshop needed)

```bash
npm run build:server
npm run lint
npm run verify:photoshop-prompts
```

Run these before every PR.

### Recommended (Photoshop must be running)

```bash
npm run test:mcp-local    # prompt-layer smoke tests
npm run spike:issue-2     # issue #2 targeted regression
npm run test:mcp-all      # full sequential tool sweep
```

Integration tests communicate with a live Photoshop instance over stdio — the same path used by Cursor and Claude Desktop. Note which tests you ran in your PR description.

## Pull request checklist

- [ ] PR title, description, and commit messages are in **English**
- [ ] Code comments and user-facing strings are in **English**
- [ ] `npm run lint` passes
- [ ] `npm run build:server` passes
- [ ] `npm run verify:photoshop-prompts` passes
- [ ] Integration tests run (if applicable — requires Photoshop)
- [ ] Screenshots attached for UI changes

A [pull request template](.github/pull_request_template.md) is provided automatically when you open a PR on GitHub.

## Reporting bugs

Open a [GitHub Issue](https://github.com/alisaitteke/photoshop-mcp/issues) and include:

- Operating system (Windows / macOS) and version
- Photoshop version
- Node.js version
- Steps to reproduce
- Expected vs. actual behavior
- Relevant log output (`LOG_LEVEL=0` for debug)

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
