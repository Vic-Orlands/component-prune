import fs from "fs/promises";
import type { ComponentFile } from "./types";

export async function removeUnused(unused: ComponentFile[]) {
  for (const component of unused) {
    try {
      await fs.unlink(component.filePath);
    } catch (err) {
      console.error(`Failed to delete ${component.filePath}:`, err);
    }
  }
}
