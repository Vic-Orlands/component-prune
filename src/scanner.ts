import fg from "fast-glob";
import path from "path";
import type { ComponentFile } from "./types";

const DEFAULT_EXTENSIONS = [
  "ts",
  "tsx",
  "js",
  "jsx",
  "svelte",
  "vue",
  "solid.js",
];

const EXCLUDE_DIRS = [
  "node_modules",
  ".next",
  "dist",
  "build",
  ".vercel",
  ".output",
];

export async function scanComponents(
  rootDir: string,
  additionalIgnorePatterns: string[] = []
): Promise<ComponentFile[]> {
  const pattern = `**/*.{${DEFAULT_EXTENSIONS.join(",")}}`;

  const ignore = [
    ...EXCLUDE_DIRS.map((d) => `${d}/**`),
    ...additionalIgnorePatterns,
  ];

  const entries = await fg(pattern, {
    cwd: rootDir,
    ignore,
    absolute: true,
  });

  return entries
    .filter((file) => isLikelyComponent(file))
    .map((filePath) => ({
      filePath,
      name: path.basename(filePath, path.extname(filePath)),
      extension: path.extname(filePath),
    }));
}

function isLikelyComponent(filePath: string): boolean {
  const filename = path.basename(filePath);
  const isInUiDir = filePath.includes(path.join("components", "ui"));
  return (
    isInUiDir ||
    /^[A-Z][A-Za-z0-9]*\.(tsx|jsx|js|ts|svelte|vue|solid\.js)$/.test(filename)
  );
}
