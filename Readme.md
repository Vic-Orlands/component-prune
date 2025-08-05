# component-prune

A CLI tool to scan, analyze, and optionally remove unused UI components across modern web frameworks like React, Vue, Svelte, and Solid. Ideal for cleaning up monorepos, design systems, or frontend codebases with stale components.

## Features

- **Fast static scan** using `fast-glob`
- **Usage analysis** across multiple file types and import styles
- **Selective component removal** by specifying component names
- **Auto-deletion** of unused components with `--remove`
- **JSON report output** for used and unused components
- **Framework-agnostic**: supports `.tsx`, `.jsx`, `.js`, `.ts`, `.vue`, `.svelte`, `.solid.js`, `.astro`, `.mdx`
- **Customizable ignore rules** via `.componentignore`
- **Special handling** for shadcn components in `components/ui`
- **Flexible naming conventions**: supports PascalCase, camelCase, kebab-case, and snake_case

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
component-prune [path] [components...] [options]
```

### Arguments

| Argument        | Description                                                         | Default |
| --------------- | ------------------------------------------------------------------- | ------- |
| `path`          | Directory to scan for components                                    | `.`     |
| `components...` | Specific component names to remove (e.g., `calendar.tsx sheet.tsx`) | None    |

### Options

| Flag            | Description                                       | Default |
| --------------- | ------------------------------------------------- | ------- |
| `--remove`      | Automatically delete unused components            | `false` |
| `--verbose`     | Show used and unused components in output         | `false` |
| `--json <path>` | Output results as a JSON report to specified path | `null`  |
| `-V, --version` | Display version number                            |         |
| `-h, --help`    | Display help message                              |         |

## How It Works

### 1. Scan Components

Recursively searches for component files in the specified directory, including `components/ui` for shadcn components. Supports:

- **File extensions**: `.tsx`, `.jsx`, `.js`, `.ts`, `.vue`, `.svelte`, `.solid.js`, `.astro`, `.mdx`
- **Naming conventions**: PascalCase (`Button.tsx`), camelCase (`myComponent.tsx`), kebab-case (`my-component.tsx`), snake_case (`my_component.tsx`)

### 2. Analyze Usage

Determines if components are imported or referenced (e.g., via JSX or barrel files like `components/ui/index.tsx`).

### 3. Remove (Optional)

Deletes unused components, either all or specific ones listed in the command, when `--remove` is used.

## Ignore Rules

Ignores common folders: `node_modules`, `.next`, `dist`, `build`, `.vercel`, `.output`. Customize with a `.componentignore` file in the project root.

## JSON Output

Use `--json` to save results:

```json
{
  "used": [{ "name": "Button", "filePath": "src/components/ui/button.tsx" }],
  "unused": [
    { "name": "Calendar", "filePath": "src/components/ui/calendar.tsx" }
  ]
}
```

## Examples

### List all unused components

```bash
component-prune src --verbose
```

Output:

```
Used components (1):
  - src/components/ui/button.tsx
Unused components (2):
  - src/components/ui/calendar.tsx
  - src/components/ui/sheet.tsx
```

### List specific unused components

```bash
component-prune src calendar.tsx sheet.tsx
```

Output:

```
Unused components (2):
  - src/components/ui/calendar.tsx
  - src/components/ui/sheet.tsx
```

### Remove specific unused components

```bash
component-prune src calendar.tsx sheet.tsx --remove
```

Output:

```
Unused components (2):
  - src/components/ui/calendar.tsx
  - src/components/ui/sheet.tsx
🧹 Selected unused components deleted.
```

### Generate JSON report

```bash
component-prune src calendar.tsx --json report.json
```

Output:

```
Unused components (1):
  - src/components/ui/calendar.tsx
📄 JSON report saved to report.json
```

## Programmatic Usage

Import as a Node module:

- `scanComponents(rootDir, ignorePatterns)`: Returns component files
- `analyzeUsage(components, rootDir)`: Returns `{ used, unused }`
- `removeUnused(unused)`: Deletes specified components
- `loadIgnorePatterns(rootDir)`: Loads `.componentignore`
- `writeJSONReport(used, unused, outputPath)`: Writes JSON report

## License

MIT License © 2025

**Developed by Chimezie Innocent**

## Contributing

Contributions welcome! Submit pull requests or open issues [https://github.com/Vic-Orlands/component-prune](https://github.com/Vic-Orlands/component-prune).
