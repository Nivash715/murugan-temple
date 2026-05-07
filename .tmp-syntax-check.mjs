import { Parser } from "./node_modules/acorn/dist/acorn.mjs";
import jsx from "./node_modules/acorn-jsx/index.js";
import { readFileSync } from "node:fs";
import { argv } from "node:process";

const JsxParser = Parser.extend(jsx());
const files = argv.slice(2);
let ok = true;
for (const f of files) {
  try {
    JsxParser.parse(readFileSync(f, "utf8"), {
      ecmaVersion: "latest",
      sourceType: "module",
      allowImportExportEverywhere: true,
      allowAwaitOutsideFunction: true,
    });
    console.log("ok    " + f);
  } catch (e) {
    ok = false;
    console.log("FAIL  " + f + " :: " + e.message);
  }
}
process.exit(ok ? 0 : 1);
