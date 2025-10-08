import fs from "fs";
import path from "path";

const schemaDir = process.cwd();
const outputFile = path.join(schemaDir, "index.json");

function getSchemaFiles() {
  return fs.readdirSync(schemaDir).filter(f => f.endsWith(".schema.json"));
}

function buildSchemaMetadata(filename) {
  const content = JSON.parse(fs.readFileSync(filename, "utf8"));
  const stats = fs.statSync(filename);
  const versionMatch = filename.match(/v(\d+(?:\.\d+){0,2})/);
  const version = versionMatch ? versionMatch[1] : "1.0.0";

  return {
    name: content.title || filename.replace(".schema.json", ""),
    version,
    file: filename,
    description: content.description || "No description provided.",
    url: `https://schema.nunneo.io/${filename}`,
    last_updated: stats.mtime.toISOString(),
  };
}

function generateIndex() {
  const files = getSchemaFiles();
  const schemas = files.map(buildSchemaMetadata);

  const registry = {
    schema_registry: "nunNEO | Sweep & Co",
    base_url: "https://schema.nunneo.io",
    total_schemas: schemas.length,
    schemas,
    generated_at: new Date().toISOString()
  };

  fs.writeFileSync(outputFile, JSON.stringify(registry, null, 2));
  console.log(`✅ Schema index generated with ${schemas.length} entries.`);
}

generateIndex();
