import fs from "fs/promises";
import type { ComponentFile } from "./types";

export async function writeJSONReport(
  used: ComponentFile[],
  unused: ComponentFile[],
  outputPath: string
) {
  const report = {
    used: used.map((c) => ({ name: c.name, file: c.filePath })),
    unused: unused.map((c) => ({ name: c.name, file: c.filePath })),
  };

  await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
}
