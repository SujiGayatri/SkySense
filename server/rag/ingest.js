import fs from "fs";
import path from "path";
import { getCollection } from "./chroma.js";

const folder = "./rag/documents";

async function ingest() {
  const collection = await getCollection();

  const files = fs.readdirSync(folder);

  for (const file of files) {
    const text = fs.readFileSync(
      path.join(folder, file),
      "utf8"
    );
    const category = file.replace(".txt", "");

    await collection.upsert({
      ids: [file],
      documents: [text],
      metadatas: [{ source: file,category,version: "1.0" }],
    });

    console.log(`${file} added`);
  }
}

ingest();