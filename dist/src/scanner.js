import fg from "fast-glob";
import path from "path";
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
export async function scanComponents(rootDir, additionalIgnorePatterns = []) {
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
function isLikelyComponent(filePath) {
    const filename = path.basename(filePath);
    return /^[A-Z][A-Za-z0-9]*\.(tsx|jsx|js|ts|svelte|vue|solid\.js)$/.test(filename);
}
