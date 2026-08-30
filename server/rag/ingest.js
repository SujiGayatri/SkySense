import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getCollection } from "./chroma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const folder = path.join(__dirname, "documents");

async function ingest() {
  const collection = await getCollection();

  const files = fs.readdirSync(folder);

  for (const file of files) {
    if (!file.endsWith(".txt")) continue;

    const text = fs.readFileSync(
      path.join(folder, file),
      "utf8"
    );

    const category = file.replace(".txt", "");

    await collection.upsert({
      ids: [file],
      documents: [text],
      metadatas: [
        {
          source: file,
          category,
          version: "1.0",
        },
      ],
    });

    console.log(`${file} added`);
  }
}

ingest().catch((error) => {
  console.error("Ingestion failed:", error);
  process.exit(1);
});