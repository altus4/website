# Markdown Linting Setup

This project uses `markdownlint-cli2` to ensure consistent markdown formatting across all documentation files.

## Configuration

The markdown linting rules are configured in `.markdownlint.json`:

- **Line Length**: Maximum 150 characters (excluding code blocks, tables, and headings)
- **Heading Style**: ATX style (`# Heading`)
- **Code Blocks**: Fenced style preferred
- **Emphasis Style**: Underscore style (`__bold__`, `_italic_`)
- **HTML Elements**: Allowed for VitePress compatibility
- **Disabled Rules**:
  - MD025: Multiple H1 headings (common in VitePress with frontmatter)
  - MD029: Ordered list numbering (allows flexible numbering)
  - MD036: Emphasis as headings (common in documentation)
  - MD040: Code block language (not always necessary)
  - MD041: First line in file (frontmatter compatibility)

## Usage

### Linting Commands

```bash
# Lint all markdown files
npm run lint:md

# Auto-fix markdown issues
npm run lint:md:fix

# Lint both code and markdown
npm run lint:all

# Format everything (code + markdown + prettier)
npm run format:all
```

### Integration with Development Workflow

The markdown linting is integrated into the main linting pipeline:

- `npm run lint:all` - Runs ESLint + markdownlint
- `npm run format` - Runs ESLint fix + markdownlint fix + Prettier
- `npm run format:check` - Checks all formatting without fixing

## Current Status

As of the latest update:
- **Total markdown files**: 45
- **Remaining issues**: 46 (all line length violations)
- **Auto-fixed issues**: ~2900 → 46 (98% improvement)

The remaining line length issues are mostly in frontmatter descriptions and can be addressed individually as needed.

## Benefits

1. **Consistency**: Ensures uniform markdown formatting across all documentation
2. **Quality**: Catches common markdown formatting issues
3. **Automation**: Auto-fixes most formatting problems
4. **VitePress Compatibility**: Configured to work seamlessly with VitePress
5. **CI/CD Ready**: Can be integrated into GitHub Actions for automated checks

## Rules Reference

For detailed information about markdownlint rules, see:
- [markdownlint Rules](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)
- [markdownlint-cli2 Documentation](https://github.com/DavidAnson/markdownlint-cli2)
