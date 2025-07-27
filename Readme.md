# component-prune

A CLI tool to scan, analyze, and optionally remove unused UI components across modern web frameworks such as React, Vue, Svelte, Solid, and others. Designed for monorepos, design systems, or frontend codebases with stale components, this tool identifies unused components and enables safe cleanup.

## Features

- **Fast static scan** using fast-glob
- **Usage analysis** across multiple file types and import styles
- **Optional auto-deletion** of unused components
- **JSON report output** for used and unused components
- **Framework-agnostic**: supports `.tsx`, `.jsx`, `.vue`, `.svelte`, `.js`, and more
- **Customizable ignore rules** via `.componentpruneignore`

## Installation

Install globally with npm:

```bash
npm install -g component-prune
```

Or run directly with npx:

```bash
npx component-prune
```

## Usage

```bash
component-prune [path] [options]
```

### Options

| Flag            | Description                                       | Default |
| --------------- | ------------------------------------------------- | ------- |
| `path`          | Directory to scan for components                  | `.`     |
| `--remove`      | Automatically delete unused components            | `false` |
| `--verbose`     | Show used components in output                    | `false` |
| `--json <path>` | Output results as a JSON report to specified path | `null`  |
| `-V, --version` | Display version number                            |         |
| `-h, --help`    | Display help message                              |         |

## How It Works

### 1. Scan Components

Recursively searches for files following UI component naming conventions (e.g., `PascalCase.tsx`, `Component.vue`).

**Supported file extensions:** `.tsx`, `.ts`, `.jsx`, `.js`, `.vue`, `.svelte`

### 2. Analyze Usage

Checks each scanned component to determine if it is imported or referenced within the project.

### 3. Remove (Optional)

When the `--remove` flag is used, the tool safely deletes unused component files.

## Ignore Rules

By default, ignores common folders: `node_modules`, `.next`, `dist`, `build`, `.vercel`, `.output`.

Customize ignored paths by adding a `.componentpruneignore` file in the project root.

## JSON Output

Use the `--json` option to save results in JSON format:

```json
{
  "used": [{ "filePath": "...", "name": "Button", "extension": ".tsx" }],
  "unused": [{ "filePath": "...", "name": "OldHeader", "extension": ".vue" }]
}
```

## Programmatic Usage

Import and use component-prune as a Node module:

- `scanComponents(rootDir, ignorePatterns)`: Scans and returns likely component files
- `analyzeUsage(components, rootDir)`: Returns `{ used, unused }` arrays
- `removeUnused(unused: ComponentFile[])`: Deletes specified unused component files
- `loadIgnorePatterns(rootDir)`: Loads ignore rules from `.componentpruneignore`
- `writeJSONReport(used, unused, outputPath)`: Writes a JSON summary to file

## File Structure

```
component-prune/
├── bin/
│   └── index.ts          # CLI entry point
├── src/
│   ├── scanner.ts        # Component scanner
│   ├── usageAnalyzer.ts  # Usage analyzer
│   ├── remover.ts        # Auto-removal logic
│   ├── config.ts         # Ignore file loader
│   └── utils.ts          # Helpers (writeJSONReport, etc)
│   └── types.ts          # Component type
```

## Example

```bash
component-prune src/components --remove --json ./prune-report.json
```

This command:

- Analyzes the `src/components` directory
- Deletes unused components
- Saves results to `prune-report.json`

## Example output:

```bash
Unused components (1):
  - src/components/Testing.tsx
JSON report saved to ./prune-report.json
Unused components deleted.
```

### With `--verbose`:

```bash
component-prune src/components --verbose
```

### Example Output

```bash
Used components (1):
  - src/components/Icons.jsx
Unused components (1):
  - src/components/Testing.tsx
```

## License

MIT License © 2025

Developed by [MezieIV](https://github.com/Vic-Orlands)

## Contributing

Contributions are welcome! Submit pull requests, open issues, or suggest features.
