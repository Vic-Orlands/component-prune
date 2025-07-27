import path from "path";
import fs from "fs/promises";

export async function loadIgnorePatterns(rootDir: string): Promise<string[]> {
  const ignorePath = path.join(rootDir, ".componentignore");
  try {
    const content = await fs.readFile(ignorePath, "utf-8");
    return content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return []; // No ignore file = no extra ignores
  }
}
