import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";

import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/users.routes";
import recordRoutes from "./modules/records/records.routes";
import summaryRoutes from "./modules/summary/summary.routes";
import { errorHandler } from "./shared/middleware/errorHandler";

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const openApiPath = path.join(process.cwd(), "docs", "openapi.json");
const openApiSpec = fs.existsSync(openApiPath)
  ? JSON.parse(fs.readFileSync(openApiPath, "utf-8"))
  : null;

app.get("/", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/swagger.json", (req, res) => {
  if (!openApiSpec) {
    return res.status(500).json({ error: "OpenApiSpecNotFound" });
  }
  return res.json(openApiSpec);
});

app.use((req, res, next) => {
  // Redirect ONLY the exact "/swagger" (or "/swagger?...") to avoid redirect loops.
  // Express route matching treats "/swagger" and "/swagger/" as equivalent.
  if (req.originalUrl === "/swagger" || req.originalUrl.startsWith("/swagger?")) {
    const query = req.originalUrl.includes("?") ? req.originalUrl.slice(req.originalUrl.indexOf("?")) : "";
    return res.redirect(301, `/swagger/${query}`);
  }
  return next();
});

app.get("/swagger/", (req, res) => {
  if (!openApiSpec) {
    return res.status(500).send("OpenApiSpecNotFound");
  }

  // Serve Swagger UI via CDN to avoid serverless/static-asset issues.
  // Still loads the live spec from our own endpoint.
  return res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      html, body { margin: 0; padding: 0; background: #0b0f14; }
      #swagger-ui { background: white; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function () {
        window.ui = SwaggerUIBundle({
          url: '/swagger.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          presets: [
            SwaggerUIBundle.presets.apis,
            SwaggerUIStandalonePreset
          ],
          layout: 'StandaloneLayout'
        });
      };
    </script>
  </body>
</html>`);
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/records", recordRoutes);
app.use("/summary", summaryRoutes);

app.use(errorHandler);

export default app;
