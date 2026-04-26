# Lube Junction Keyword Generator

Node.js tool for generating platform-specific social media keywords/hashtags for the Tanzania oil and lubricants market.

## Features
- `generateKeywords(platform, seedKeyword, location)` logic for TikTok/Instagram.
- Intent + problem + service + localization expansion.
- Swahili/local keyword variants.
- Ready-to-post hashtag strings.
- Optional competition score + content angle metadata.
- Gemini/Nano Banana image preview endpoint.

## Run

```bash
npm start
```

Open `http://localhost:3000`.

## Gemini setup

```bash
export GEMINI_API_KEY=your_key
# Optional:
export GEMINI_IMAGE_MODEL=gemini-2.0-flash-preview-image-generation
```

Then use **Gemini / Nano Banana Image Preview** in the UI.
