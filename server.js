import http from "http";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { generateKeywords } from "./src/services/keywordGenerator.js";
import { generatePreviewImage } from "./src/services/imageGenerator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, "public");

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload, null, 2));
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function serveStatic(res, filepath, contentType) {
  try {
    const file = await readFile(filepath);
    res.writeHead(200, { "Content-Type": contentType });
    res.end(file);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    return serveStatic(res, path.join(publicDir, "index.html"), "text/html; charset=utf-8");
  }

  if (req.method === "GET" && req.url === "/app.js") {
    return serveStatic(res, path.join(publicDir, "app.js"), "application/javascript; charset=utf-8");
  }

  if (req.method === "GET" && req.url === "/styles.css") {
    return serveStatic(res, path.join(publicDir, "styles.css"), "text/css; charset=utf-8");
  }

  if (req.method === "POST" && req.url === "/api/generate-keywords") {
    try {
      const { platform, seedKeyword, location } = await parseBody(req);

      if (!platform || !seedKeyword) {
        return sendJson(res, 400, {
          error: "platform and seedKeyword are required"
        });
      }

      const result = generateKeywords(platform, seedKeyword, location || "Tanzania");
      return sendJson(res, 200, result);
    } catch (error) {
      return sendJson(res, 500, {
        error: "Failed to generate keywords",
        detail: error.message
      });
    }
  }

  if (req.method === "POST" && req.url === "/api/generate-image") {
    try {
      const { prompt } = await parseBody(req);
      if (!prompt) return sendJson(res, 400, { error: "prompt is required" });

      const result = await generatePreviewImage(prompt);
      return sendJson(res, 200, result);
    } catch (error) {
      return sendJson(res, 500, {
        error: "Image generation failed",
        detail: error.message
      });
    }
  }

  res.writeHead(404);
  res.end("Not found");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Lube Junction tool running at http://localhost:${port}`);
});
