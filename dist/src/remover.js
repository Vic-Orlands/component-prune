import fs from "fs/promises";
export async function removeUnused(unused) {
    for (const component of unused) {
        try {
            await fs.unlink(component.filePath);
        }
        catch (err) {
            console.error(`Failed to delete ${component.filePath}:`, err);
        }
    }
}
