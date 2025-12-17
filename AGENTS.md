# AGENTS.md

OpenCode personal configuration repository. Contains custom agents, commands, and plugins.

## Build/Test Commands

No build system - this is a configuration directory. To test plugins, restart OpenCode.

## Code Style

### JavaScript (plugins)
- ES modules with named exports: `export const PluginName = async ({ client, directory, $ }) => {}`
- Async/await for asynchronous code
- Destructure function parameters
- PascalCase for export names, lowercase filenames

### Markdown (agents/commands)
- YAML frontmatter with `description` and `mode` fields
- Kebab-case filenames: `document-platform.md`

## Structure
- `agent/` - Custom agents (Markdown with YAML frontmatter, `mode: primary`)
- `command/` - Slash commands (Markdown with YAML frontmatter)
- `plugin/` - JavaScript plugins using `@opencode-ai/plugin`
- `opencode.json` - Main config (use schema: `https://opencode.ai/config.json`)

## Dependencies
Runtime: Bun. Packages: `@opencode-ai/plugin`, `@types/bun`
