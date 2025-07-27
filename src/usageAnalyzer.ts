import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
import type { ComponentFile } from "./types";

const CODE_EXTENSIONS = ["ts", "tsx", "js", "jsx", "svelte", "vue", "solid.js"];
const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".vercel",
  ".output",
];

export async function analyzeUsage(
  components: ComponentFile[],
  rootDir: string
): Promise<{ used: ComponentFile[]; unused: ComponentFile[] }> {
  const codeFiles = await fg(`**/*.{${CODE_EXTENSIONS.join(",")}}`, {
    cwd: rootDir,
    ignore: EXCLUDE_DIRS.map((d) => `${d}/**`),
    absolute: true,
  });

  const usedSet = new Set<string>();

  const componentMap = new Map<string, ComponentFile>();
  for (const c of components) {
    componentMap.set(path.basename(c.filePath), c);
  }

  await Promise.all(
    codeFiles.map(async (file) => {
      const content = await fs.readFile(file, "utf-8");

      for (const component of components) {
        const baseName = path.basename(component.filePath, component.extension);

        // Match import statements
        const importPattern = new RegExp(
          `from\\s+['"][^'"]*${baseName}(\\.[jt]sx?|\\.svelte|\\.vue|\\.solid\\.js)?['"]`,
          "g"
        );

        // Match JSX usage
        const jsxPattern = new RegExp(`<${baseName}[\\s/>]`, "g");

        if (importPattern.test(content) || jsxPattern.test(content)) {
          usedSet.add(component.filePath);
        }
      }
    })
  );

  const used = components.filter((c) => usedSet.has(c.filePath));
  const unused = components.filter((c) => !usedSet.has(c.filePath));

  return { used, unused };
}
