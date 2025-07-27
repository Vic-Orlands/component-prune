import fs from "fs/promises";
export async function writeJSONReport(used, unused, outputPath) {
    const report = {
        used: used.map((c) => ({ name: c.name, file: c.filePath })),
        unused: unused.map((c) => ({ name: c.name, file: c.filePath })),
    };
    await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
}
