const keywordForm = document.getElementById("keyword-form");
const imageForm = document.getElementById("image-form");
const output = document.getElementById("output");
const imageResult = document.getElementById("image-result");

keywordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(keywordForm);

  const payload = {
    platform: formData.get("platform"),
    seedKeyword: formData.get("seedKeyword"),
    location: formData.get("location")
  };

  output.textContent = "Generating...";

  const response = await fetch("/api/generate-keywords", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json();
  output.textContent = JSON.stringify(data, null, 2);
});

imageForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(imageForm);

  imageResult.textContent = "Generating preview image...";

  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: formData.get("prompt") })
  });

  const data = await response.json();

  if (!data.ok) {
    imageResult.textContent = data.message || data.error || "Image generation failed.";
    return;
  }

  if (data.image_base64) {
    imageResult.innerHTML = `<p>${data.message}</p><img alt="Generated preview" src="data:${data.mime_type};base64,${data.image_base64}" />`;
    return;
  }

  imageResult.textContent = data.message || "Image request completed without an inline image.";
});
