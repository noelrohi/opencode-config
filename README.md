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

### gemini-image.ts
**Tool:** `gemini_image`

Generate and edit images using the Gemini (Nano Banana) API. Supports text-to-image and image-to-image workflows.

**Setup:**

1. Get your API key at https://aistudio.google.com/apikey
2. Set the environment variable:

```fish
# fish (~/.config/fish/config.fish)
set -gx GEMINI_API_KEY "your-api-key-here"
```

```bash
# bash/zsh (~/.bashrc or ~/.zshrc)
export GEMINI_API_KEY="your-api-key-here"
```

**Usage:**

```
# Text-to-image
gemini_image({ prompt: "A cat wearing a wizard hat" })

# Image-to-image (editing)
gemini_image({ prompt: "Add a sunset background", input_images: ["photo.jpg"] })

# Pro model with custom settings
gemini_image({
  prompt: "Product shot of a coffee mug",
  model: "pro",
  aspect_ratio: "16:9",
  resolution: "4K"
})
```

**Options:**
| Arg | Type | Default | Description |
|-----|------|---------|-------------|
| `prompt` | string | required | Text prompt for generation/editing |
| `input_images` | string[] | - | File paths for i2i (up to 3 flash, 14 pro) |
| `model` | `"flash"` \| `"pro"` | `"flash"` | Model selection |
| `aspect_ratio` | string | `"1:1"` | Output ratio (1:1, 16:9, 9:16, etc.) |
| `resolution` | `"1K"` \| `"2K"` \| `"4K"` | `"1K"` | Pro model only |
| `filename` | string | auto | Custom output filename |

**Output:** Images saved to `generated-images/` directory.

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
│   ├── notify.js           # Completion notifications
│   └── gemini-image.ts     # Image generation tool
├── generated-images/       # Output directory for generated images
├── opencode.json           # Main config
├── package.json            # Plugin dependencies
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Dependencies

```json
{
  "@google/genai": "^1.0.0",
  "@opencode-ai/plugin": "1.0.164",
  "@types/bun": "^1.3.4"
}
```
