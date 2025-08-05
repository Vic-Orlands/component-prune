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
    const components = entries
        .filter((file) => {
        // const isComponent = isLikelyComponent(file);
        // console.log(`File: ${file}, Is Component: ${isComponent}`);
        return isLikelyComponent(file);
    })
        .map((filePath) => ({
        filePath,
        name: path.basename(filePath, path.extname(filePath)),
        extension: path.extname(filePath),
    }));
    return components;
}
// this function uses regex to detect diff naming convention of components
// --kebab, camel, pascal, snake, etc
// --all components inside components/ui/ dir is treated as component regardless of naming convention
function isLikelyComponent(filePath) {
    const filename = path.basename(filePath);
    const isInUiDir = filePath.includes(path.join("components", "ui"));
    return (isInUiDir || // Include all files in components/ui
        /^[A-Za-z][A-Za-z0-9_-]*\.(tsx|jsx|js|ts|svelte|vue|solid\.js)$/.test(filename));
}
