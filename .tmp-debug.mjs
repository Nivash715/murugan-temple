import { Parser } from "./node_modules/acorn/dist/acorn.mjs";
import jsx from "./node_modules/acorn-jsx/index.js";
import { readFileSync } from "node:fs";

const JsxParser = Parser.extend(jsx());
const f = process.argv[2];
const src = readFileSync(f, "utf8");
try {
  JsxParser.parse(src, { ecmaVersion: "latest", sourceType: "module" });
  console.log("ok");
} catch (e) {
  console.log("FAIL", e.message, "pos", e.pos, "loc", e.loc);
  const start = Math.max(0, e.pos - 120);
  const end = Math.min(src.length, e.pos + 120);
  console.log("---context---");
  console.log(JSON.stringify(src.slice(start, end)));
  console.log("------------");
  // also print the line with column markers
  const lines = src.split("\n");
  if (e.loc) {
    const line = lines[e.loc.line - 1] || "";
    console.log("LINE:", line);
    console.log("HERE:", " ".repeat(e.loc.column) + "^");
  }
}
