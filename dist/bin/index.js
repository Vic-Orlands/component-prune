#!/usr/bin/env node
import { scanComponents } from "../src/scanner.js";
import { analyzeUsage } from "../src/usageAnalyzer.js";
import { removeUnused } from "../src/remover.js";
import { loadIgnorePatterns } from "../src/config.js";
import { writeJSONReport } from "../src/utils.js";
import { Command } from "commander";
import path from "path";
const program = new Command();
program
    .name("component-prune")
    .description("Find and remove unused UI components across frameworks")
    .version("0.1.0")
    .argument("[path]", "directory to scan for components", ".")
    .option("--remove", "auto delete unused components")
    .option("--verbose", "output used files optionally")
    .option("--json <path>", "output result to JSON file")
    .parse(process.argv);
(async () => {
    const opts = program.opts();
    const rootDir = path.resolve(program.args[0] || ".");
    const ignorePatterns = await loadIgnorePatterns(rootDir);
    const components = await scanComponents(rootDir, ignorePatterns);
    const { used, unused } = await analyzeUsage(components, rootDir);
    if (unused.length === 0) {
        console.log("🎉 No unused components found.");
    }
    else {
        console.log(`🛑 Unused components (${unused.length})`);
        unused.forEach((c) => console.log(`  - ${c.filePath}`));
    }
    if (opts.json) {
        await writeJSONReport(used, unused, opts.json);
        console.log(`📄 JSON report saved to ${opts.json}`);
    }
    if (opts.json) {
        await writeJSONReport(used, unused, opts.json);
        console.log(`JSON report saved to ${opts.json}`);
    }
    if (opts.remove && unused.length > 0) {
        await removeUnused(unused);
        console.log("🧹 Unused components deleted.");
    }
})();
