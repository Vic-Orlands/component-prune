import fs from "fs";

const file = "dist/bin/index.js";
const code = fs.readFileSync(file, "utf8");

if (!code.startsWith("#!")) {
  fs.writeFileSync(file, `#!/usr/bin/env node\n${code}`);
}
