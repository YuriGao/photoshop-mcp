# Photoshop MCP

[![npm version](https://img.shields.io/npm/v/@alisaitteke/photoshop-mcp.svg)](https://www.npmjs.com/package/@alisaitteke/photoshop-mcp)
[![GitHub release](https://img.shields.io/github/v/release/alisaitteke/photoshop-mcp?include_prereleases)](https://github.com/alisaitteke/photoshop-mcp/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-lightgrey.svg)]()
[![MCP Registry](https://img.shields.io/badge/MCP%20Registry-io.github.alisaitteke%2Fphotoshop--mcp-purple.svg)](https://registry.modelcontextprotocol.io)
[![MCP Toplist](https://mcptoplist.com/badge/io.github.alisaitteke%2Fphotoshop-mcp.svg)](https://mcptoplist.com/server/io.github.alisaitteke%2Fphotoshop-mcp)

**Chat with Photoshop like a colleague.** Describe what you want in plain words —
"remove this background", "resize these for Instagram" — and your AI assistant
does the clicking for you. Works with Cursor, Claude, or VS Code. No code, no scripts.

> **Note:** This is an unofficial, community-maintained project and is not affiliated with or endorsed by Adobe Inc.

## What can it do?

- ✂️ **Remove backgrounds** — subject isolated with a clean, editable mask
- 👤 **Retouch portraits** — skin smoothing, tone fixes, dodge & burn setup
- 🌐 **Export for web & social** — sRGB, sharpened, correctly sized for Instagram, X, and more
- 🎞️ **Make carousels** — split one wide design into seamless, numbered slides
- 💧 **Watermark in bulk** — a whole folder of photos in one go, originals untouched
- 🎨 **Color grade & more** — film looks, sky replacement, generative fill (Adobe account required)
- ⏪ **Stay safe** — every multi-step "recipe" is a single undo step in Photoshop

Under the hood: 118 tools (102 atomic + 16 one-step recipes) — full list in
[`docs/available-tools.md`](docs/available-tools.md).

## Try saying

```
Remove the background from this portrait — keep it editable with a mask.
```

```
Enhance this portrait — smooth the skin and fix the tones, medium intensity.
```

```
Prepare this design for web, then export Instagram and X post variants.
```

```
Split this wide banner into a 5-slide seamless Instagram carousel.
```

More recipes (batch watermark, passport photos, CSV-driven cards, mockups, …) and
pre-engineered prompt templates: [`docs/prompt-layer.md`](docs/prompt-layer.md).

## Get started

You need **Photoshop running** (Windows or macOS, any version 2012+) and **Node.js 18+**.

[![Install in Cursor](https://cursor.com/deeplink/mcp-install-dark.svg)](https://cursor.com/en/install-mcp?name=photoshop&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBhbGlzYWl0dGVrZS9waG90b3Nob3AtbWNwIl19)
[![Install in VS Code](https://img.shields.io/badge/Install%20in-VS%20Code-0098FF)](https://vscode.dev/redirect/mcp/install?name=photoshop&config=%7B%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40alisaitteke%2Fphotoshop-mcp%22%5D%7D)

Claude Code:

```bash
claude mcp add photoshop -- npx -y @alisaitteke/photoshop-mcp
```

Or add this to your MCP client's config (Cursor, Claude Desktop, …):

```json
{
  "mcpServers": {
    "photoshop": {
      "command": "npx",
      "args": ["-y", "@alisaitteke/photoshop-mcp"]
    }
  }
}
```

## How it works

1. **You type** what you want in plain language.
2. **The AI plans** the steps, checking the document state first.
3. **Photoshop executes** — each recipe lands as one undoable step.

Something went wrong? The AI reads the structured error and knows what to try
next. Common fixes: [`docs/troubleshooting.md`](docs/troubleshooting.md).

## Documentation

- [Available tools](docs/available-tools.md) — all 118 tools with parameters
- [Prompt layer](docs/prompt-layer.md) — prompt templates and recipes
- [Architecture](docs/architecture.md) — how the bridge works under the hood
- [Development](docs/development.md) — build from source, tests

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

## Maintainer

Built by **[Ali Sait Teke](https://alisait.com)** — [GitHub](https://github.com/alisaitteke) · [LinkedIn](https://www.linkedin.com/in/alisait/).

## License

MIT
