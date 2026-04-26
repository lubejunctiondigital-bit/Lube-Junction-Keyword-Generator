const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

export async function generatePreviewImage(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.0-flash-preview-image-generation";

  if (!apiKey) {
    return {
      ok: false,
      message:
        "GEMINI_API_KEY not configured. Add it to environment variables to enable Nano Banana/Gemini image previews."
    };
  }

  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Create a social-media creative concept for: ${prompt}. Focus on Tanzania automotive lubricant audience.`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024
      }
    })
  });

  if (!response.ok) {
    const errText = await response.text();
    return { ok: false, message: `Gemini request failed: ${errText}` };
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const inline = parts.find((part) => part.inlineData?.data);
  const text = parts.find((part) => part.text)?.text;

  if (!inline?.inlineData?.data) {
    return {
      ok: true,
      message: text || "Image binary not returned by model. Prompt refinement may be required.",
      image_base64: null,
      mime_type: null
    };
  }

  return {
    ok: true,
    message: "Image generated successfully",
    image_base64: inline.inlineData.data,
    mime_type: inline.inlineData.mimeType || "image/png"
  };
}
