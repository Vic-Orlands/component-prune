import path from "path";
import fs from "fs/promises";
export async function loadIgnorePatterns(rootDir) {
    const ignorePath = path.join(rootDir, ".componentignore");
    try {
        const content = await fs.readFile(ignorePath, "utf-8");
        const patterns = content
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
        // console.log("Loaded ignore patterns:", patterns);
        return patterns;
    }
    catch {
        // console.log("No .componentignore file found, using default ignores");
        return [];
    }
}
