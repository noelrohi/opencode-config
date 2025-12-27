# OpenCode Config

Personal OpenCode configuration with custom commands, plugins, and provider settings.

## Installation

**Option 1: Clone the repository**

```bash
git clone https://github.com/noelrohi/opencode-config.git ~/.config/opencode
```

**Option 2: Copy manually**

Download or copy the `command/` and `plugin/` folders into `~/.config/opencode/`.

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

Main configuration with plugins and custom providers:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": [
    "oh-my-opencode",
    "opencode-antigravity-auth@1.2.6"
  ],
  "provider": {
    "google": {
      "models": {
        "gemini-3-pro-high": { "name": "Gemini 3 Pro High (Antigravity)" },
        "gemini-3-pro-medium": { "name": "Gemini 3 Pro Medium (Antigravity)" },
        "gemini-3-pro-low": { "name": "Gemini 3 Pro Low (Antigravity)" },
        "gemini-3-flash": { "name": "Gemini 3 Flash (Antigravity)" },
        "gemini-3-flash-lite": { "name": "Gemini 3 Flash Lite (Antigravity)" }
      }
    }
  }
}
```

**Plugins:**
- `oh-my-opencode` - Enhanced agent configurations
- `opencode-antigravity-auth` - Antigravity authentication for Gemini models

### oh-my-opencode.json

Agent model assignments:

```json
{
  "agents": {
    "librarian": { "model": "opencode/big-pickle" },
    "oracle": { "model": "anthropic/claude-opus-4-5" },
    "frontend-ui-ux-engineer": { "model": "google/gemini-3-pro-high" },
    "document-writer": { "model": "google/gemini-3-flash" },
    "multimodal-looker": { "model": "google/gemini-3-flash" }
  }
}
```

## Structure

```
~/.config/opencode/
├── command/
│   ├── document-platform.md      # Platform documentation generator
│   └── document-architecture.md  # Architecture documentation generator
├── plugin/
│   └── gemini-image.ts     # Image generation tool
├── generated-images/       # Output directory for generated images
├── opencode.json           # Main config
├── oh-my-opencode.json     # Agent model assignments
├── package.json            # Plugin dependencies
├── .env.example            # Environment variables template
├── AGENTS.md               # Repository conventions
└── README.md               # This file
```

## Dependencies

```json
{
  "@google/genai": "^1.0.0",
  "@opencode-ai/plugin": "1.0.203",
  "@types/bun": "^1.3.4"
}
```
