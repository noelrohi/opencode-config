# OpenCode Config

Personal OpenCode configuration with custom agents and plugins.

## Agents

Custom agents in `agent/` directory:

### designer.md
**Mode:** primary  
**Use:** When building frontend interfaces

Creates distinctive, production-grade UI with:
- Bold aesthetic direction (brutalist, minimalist, maximalist, etc.)
- Unique typography (avoids generic fonts like Inter, Arial)
- Intentional color schemes and spatial composition
- Motion and micro-interactions
- Creative backgrounds and visual details

```
/designer build a landing page for a meditation app
```

### documenter.md
**Mode:** secondary  
**Use:** When documenting a codebase

Generates two documentation files:
- `docs/platform.md` - UI screens, components, user flows, features
- `docs/architecture.md` - Startup flows, storage, events, data lifecycle

Process:
1. Explores codebase (entry points, routes, components, state, hooks)
2. Creates structured docs with ASCII diagrams, TypeScript interfaces, tables
3. Updates AGENTS.md/CLAUDE.md with doc references

```
/documenter document this project
```

## Plugins

Custom plugins in `plugin/` directory:

### notify.js
**Event:** `session.idle`

Plays a sound and announces the project folder name when a session completes.

```javascript
// On completion: plays Funk.aiff and says folder name
await $`afplay /System/Library/Sounds/Funk.aiff && say "${lastFolder}"`;
```

## Config

### opencode.json

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-gemini-auth"],
  "provider": {},
  "mcp": {}
}
```

**Plugins:**
- `opencode-gemini-auth` - Google Gemini authentication

## Structure

```
~/.config/opencode/
├── agent/
│   ├── designer.md      # Frontend design agent
│   └── documenter.md    # Documentation generator
├── plugin/
│   └── notify.js        # Completion notifications
├── opencode.json        # Main config
├── package.json         # Plugin dependencies
└── README.md            # This file
```

## Dependencies

```json
{
  "@opencode-ai/plugin": "1.0.164",
  "@types/bun": "^1.3.4"
}
```
