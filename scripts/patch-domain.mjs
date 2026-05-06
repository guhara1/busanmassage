import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outDir = "out";
const oldDomain = "https://busanmassage.netlify.app";
const newDomain = "https://busanrun.netlify.app";
const targetExtensions = new Set([".html", ".xml", ".txt"]);

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];

  for (const entry of entries) {
    const path = join(dir, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...walk(path));
    } else {
      files.push(path);
    }
  }

  return files;
}

function extensionOf(path) {
  const index = path.lastIndexOf(".");
  return index === -1 ? "" : path.slice(index).toLowerCase();
}

for (const file of walk(outDir)) {
  if (!targetExtensions.has(extensionOf(file))) continue;

  const before = readFileSync(file, "utf8");
  const after = before.split(oldDomain).join(newDomain);

  if (after !== before) {
    writeFileSync(file, after, "utf8");
  }
}
