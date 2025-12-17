import { type Plugin, tool } from "@opencode-ai/plugin"
import { GoogleGenAI } from "@google/genai"
import * as fs from "node:fs"
import * as path from "node:path"

const ASPECT_RATIOS = [
  "1:1",
  "2:3",
  "3:2",
  "3:4",
  "4:3",
  "4:5",
  "5:4",
  "9:16",
  "16:9",
  "21:9",
] as const

const RESOLUTIONS = ["1K", "2K", "4K"] as const

const MODELS = ["flash", "pro"] as const

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50)
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".png":
      return "image/png"
    case ".gif":
      return "image/gif"
    case ".webp":
      return "image/webp"
    default:
      return "image/jpeg"
  }
}

function generateFilename(prompt: string, customName?: string): string {
  const date = new Date().toISOString().split("T")[0]
  const name = customName ? slugify(customName) : slugify(prompt)
  return `${date}_${name}.png`
}

export const GeminiImagePlugin: Plugin = async ({ directory }) => {
  const outputDir = path.join(directory, "generated-images")

  return {
    tool: {
      gemini_image: tool({
        description:
          "Generate or edit images using Gemini (Nano Banana) API. " +
          "Supports text-to-image (t2i) and image-to-image (i2i) workflows. " +
          "For i2i, provide input_images array with file paths to edit/composite. " +
          "Uses GEMINI_API_KEY env var for authentication.",
        args: {
          prompt: tool.schema
            .string()
            .describe(
              "Text prompt describing the image to generate or how to edit input images"
            ),
          input_images: tool.schema
            .array(tool.schema.string())
            .optional()
            .describe(
              "File paths to input images for editing/composition (up to 3 for flash, 14 for pro)"
            ),
          model: tool.schema
            .enum(MODELS)
            .optional()
            .describe(
              "Model: 'flash' (fast, default) or 'pro' (higher quality, supports 4K, up to 14 input images)"
            ),
          aspect_ratio: tool.schema
            .enum(ASPECT_RATIOS)
            .optional()
            .describe("Output aspect ratio (default: 1:1)"),
          resolution: tool.schema
            .enum(RESOLUTIONS)
            .optional()
            .describe("Output resolution, pro model only (default: 1K)"),
          filename: tool.schema
            .string()
            .optional()
            .describe("Custom output filename (without extension)"),
        },
        async execute(args) {
          try {
            // Validate API key
            if (!process.env.GEMINI_API_KEY) {
              return "Error generating image: GEMINI_API_KEY environment variable is not set"
            }

            // Initialize client
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

            // Determine model
            const modelName =
              args.model === "pro"
                ? "gemini-3-pro-image-preview"
                : "gemini-2.5-flash-image"

            // Build contents array
            const contents: Array<
              { text: string } | { inlineData: { mimeType: string; data: string } }
            > = [{ text: args.prompt }]

            if (args.input_images?.length) {
              // Validate input image count
              const maxImages = args.model === "pro" ? 14 : 3
              if (args.input_images.length > maxImages) {
                return `Error generating image: Too many input images. ${args.model === "pro" ? "Pro" : "Flash"} model supports up to ${maxImages} images.`
              }

              for (const imgPath of args.input_images) {
                const fullPath = path.isAbsolute(imgPath)
                  ? imgPath
                  : path.join(directory, imgPath)

                if (!fs.existsSync(fullPath)) {
                  return `Error generating image: Input image not found: ${fullPath}`
                }

                const imageData = fs.readFileSync(fullPath)
                const base64 = imageData.toString("base64")
                const mimeType = getMimeType(fullPath)

                contents.push({
                  inlineData: { mimeType, data: base64 },
                })
              }
            }

            // Build config
            const config: {
              responseModalities: string[]
              imageConfig?: { aspectRatio?: string; imageSize?: string }
            } = {
              responseModalities: ["TEXT", "IMAGE"],
            }

            if (args.aspect_ratio || (args.resolution && args.model === "pro")) {
              config.imageConfig = {}
              if (args.aspect_ratio) {
                config.imageConfig.aspectRatio = args.aspect_ratio
              }
              if (args.resolution && args.model === "pro") {
                config.imageConfig.imageSize = args.resolution
              }
            }

            // Generate
            const response = await ai.models.generateContent({
              model: modelName,
              contents,
              config,
            })

            // Ensure output directory exists
            if (!fs.existsSync(outputDir)) {
              fs.mkdirSync(outputDir, { recursive: true })
            }

            // Process response
            let textResponse = ""
            let savedPath = ""

            const parts = response.candidates?.[0]?.content?.parts ?? []

            for (const part of parts) {
              if ("text" in part && part.text) {
                textResponse += part.text
              } else if ("inlineData" in part && part.inlineData) {
                const imageData = part.inlineData.data
                if (imageData) {
                  const filename = generateFilename(args.prompt, args.filename)
                  const fullPath = path.join(outputDir, filename)

                  // Handle potential filename collision
                  let finalPath = fullPath
                  let counter = 1
                  while (fs.existsSync(finalPath)) {
                    const ext = path.extname(filename)
                    const base = path.basename(filename, ext)
                    finalPath = path.join(outputDir, `${base}_${counter}${ext}`)
                    counter++
                  }

                  const buffer = Buffer.from(imageData, "base64")
                  fs.writeFileSync(finalPath, buffer)
                  savedPath = finalPath
                }
              }
            }

            if (!savedPath) {
              return "Error generating image: No image was returned by the model. Try adjusting your prompt."
            }

            // Build response
            const relativePath = path.relative(directory, savedPath)
            let result = `![generated image](${relativePath})`

            if (textResponse.trim()) {
              result += `\n\nModel response: ${textResponse.trim()}`
            }

            return result
          } catch (error) {
            const message =
              error instanceof Error ? error.message : String(error)
            return `Error generating image: ${message}`
          }
        },
      }),
    },
  }
}
