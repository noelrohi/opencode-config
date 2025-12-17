# OpenCode Config

Personal OpenCode configuration with custom agents, commands, and plugins.

## Installation

**Option 1: Clone the repository**

```bash
git clone https://github.com/noelrohi/opencode-config.git ~/.config/opencode
```

**Option 2: Copy manually**

Download or copy the `agent/`, `command/`, and `plugin/` folders into `~/.config/opencode/`.

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

## Commands

Custom slash commands in `command/` directory:

### document-platform.md
Generates `docs/platform.md` covering UI screens, components, user flows, and features.

```
/document-platform
```

### document-architecture.md
Generates `docs/architecture.md` covering app initialization, storage, data lifecycle, and technical flows.

```
/document-architecture
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
│   └── designer.md         # Frontend design agent
├── command/
│   ├── document-platform.md      # Platform documentation generator
│   └── document-architecture.md  # Architecture documentation generator
├── plugin/
│   └── notify.js           # Completion notifications
├── opencode.json           # Main config
├── package.json            # Plugin dependencies
└── README.md               # This file
```

## Dependencies

```json
{
  "@opencode-ai/plugin": "1.0.164",
  "@types/bun": "^1.3.4"
}
```
