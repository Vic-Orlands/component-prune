import fg from "fast-glob";
import fs from "fs/promises";
import path from "path";
const CODE_EXTENSIONS = [
    "ts",
    "tsx",
    "js",
    "jsx",
    "svelte",
    "vue",
    "solid.js",
    "astro",
    "mdx",
];
const EXCLUDE_DIRS = [
    "node_modules",
    ".next",
    "dist",
    "build",
    ".vercel",
    ".output",
];
export async function analyzeUsage(components, rootDir) {
    const codeFiles = await fg(`**/*.{${CODE_EXTENSIONS.join(",")}}`, {
        cwd: rootDir,
        ignore: EXCLUDE_DIRS.map((d) => `${d}/**`),
        absolute: true,
    });
    const usedSet = new Set();
    const componentMap = new Map();
    for (const c of components) {
        componentMap.set(path.basename(c.filePath), c);
    }
    // Check for barrel file exports
    const barrelFile = path.join(rootDir, "src", "components", "ui", "index.tsx");
    let barrelExports = [];
    try {
        await fs.access(barrelFile); // Check if barrel file exists
        const barrelContent = await fs.readFile(barrelFile, "utf-8");
        barrelExports = components
            .filter((c) => barrelContent.includes(`export * from './${c.name}'`) ||
            barrelContent.includes(`export { ${c.name} } from './${c.name}'`))
            .map((c) => c.name);
    }
    catch {
        // Barrel file doesn't exist, proceed with empty barrelExports
        // console.log(`No barrel file found at: ${barrelFile}`);
        barrelExports = [];
    }
    await Promise.all(codeFiles.map(async (file) => {
        const content = await fs.readFile(file, "utf-8");
        for (const component of components) {
            const baseName = path.basename(component.filePath, component.extension);
            // Match direct imports
            const importPattern = new RegExp(`from\\s+['"][^'"]*${baseName}(\\.[jt]sx?|\\.svelte|\\.vue|\\.solid\\.js)?['"]`, "g");
            // Match imports from barrel file
            const barrelImportPattern = new RegExp(`import\\s*\\{[^}]*${baseName}[^}]*\\}\\s*from\\s*['"][^'"]*components\\/ui(\\/index)?['"]`, "g");
            // Match JSX usage
            const jsxPattern = new RegExp(`<${baseName}[\\s/>]`, "g");
            if (importPattern.test(content) ||
                barrelImportPattern.test(content) ||
                jsxPattern.test(content) ||
                barrelExports.includes(baseName)) {
                usedSet.add(component.filePath);
            }
        }
    }));
    const used = components.filter((c) => usedSet.has(c.filePath));
    const unused = components.filter((c) => !usedSet.has(c.filePath));
    return { used, unused };
}
