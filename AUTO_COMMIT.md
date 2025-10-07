# 🚀 Auto-Commit System for EVM Incinerator

This project includes a comprehensive auto-commit system that makes it easy to commit changes with proper formatting, validation, and conventional commit messages.

## 🎯 Quick Start

### First Time Setup

1. **Install Git Hooks** (one-time setup):

   ```bash
   npm run setup-git
   ```

2. **Start Committing**:
   ```bash
   npm run auto-commit
   ```

## 📋 Available Commands

### Primary Commands

| Command                | Description                                       | Usage                       |
| ---------------------- | ------------------------------------------------- | --------------------------- |
| `npm run auto-commit`  | Interactive commit mode (skips checks by default) | Main command for committing |
| `npm run quick-commit` | Quick commit with auto-generated message          | Fast commits                |
| `npm run commit-all`   | Stage all files and commit                        | Bulk commits                |
| `npm run commit-check` | Commit with pre-commit validation enabled         | With validation             |
| `npm run setup-git`    | Install git hooks and configure aliases           | One-time setup              |

### Git Aliases (after setup)

| Alias    | Equivalent Command     |
| -------- | ---------------------- |
| `git ac` | `npm run auto-commit`  |
| `git qc` | `npm run quick-commit` |
| `git ca` | `npm run commit-all`   |

## 🔧 Features

### ✨ Smart Commit Messages

- **Automatic categorization** of changed files (components, hooks, utils, etc.)
- **Conventional commit format** (feat:, fix:, docs:, etc.)
- **File count tracking** (e.g., "feat: components changes (3 components, 2 hooks)")
- **Custom message support** for detailed descriptions

### 🛡️ Pre-Commit Validation (Disabled by Default)

- **ESLint** - Code quality and style checks (disabled by default)
- **TypeScript** - Type checking and compilation (disabled by default)
- **Prettier** - Code formatting validation (disabled by default)
- **Conventional Commits** - Message format validation (disabled by default)
- **Enable Validation** - Use `--check` flag or `npm run commit-check` to enable all validation

### 📁 File Categorization

The system automatically categorizes your changes:

| Category     | Description            | Example Files                |
| ------------ | ---------------------- | ---------------------------- |
| `components` | React components       | `components/TokenSelector/`  |
| `hooks`      | Custom React hooks     | `hooks/useBatchApprovals.ts` |
| `utils`      | Utility functions      | `utils/numberUtils.ts`       |
| `constants`  | Constants and config   | `constants/theme.ts`         |
| `styles`     | CSS and styling        | `*.css`, `theme.css`         |
| `config`     | Configuration files    | `*.json`, `next.config.js`   |
| `app`        | App router files       | `app/**/*`                   |
| `types`      | TypeScript definitions | `*.d.ts`                     |
| `other`      | Unclassified files     | Various                      |

### 🎨 Interactive Modes

#### 1. Interactive Mode (`npm run auto-commit`)

```
📋 File Changes Summary:

✅ Staged files (2):
  • components/TokenSelector/index.tsx
  • hooks/useBatchApprovals.ts

📝 Unstaged files (3):
  • utils/numberUtils.ts
  • constants/theme.ts
  • README.md

🤔 What would you like to do?
  [1] Commit staged files only
  [2] Stage all and commit
  [3] Custom commit message
  [4] Cancel

Choice (1-4):
```

#### 2. Quick Mode (`npm run quick-commit`)

- Automatically stages all files
- Generates commit message based on file changes
- No interactive prompts

#### 3. Commit All Mode (`npm run commit-all`)

- Stages all modified files
- Commits with auto-generated message
- Perfect for bulk changes

#### 4. Validation Mode (`npm run commit-check`)

- Enables all pre-commit validation (ESLint, TypeScript, Prettier)
- Ensures code quality before committing
- Perfect for production-ready commits

## 📝 Commit Message Examples

### Auto-Generated Messages

```
🚀 feat: components changes (2 components, 1 hook)
📦 fix: utils changes (1 utils, 1 config)
🚀 style: styles changes (2 styles)
📦 config: config changes (1 config, 1 other)
```

### Manual Messages (Interactive Mode)

```
feat: add batch approval functionality for EOA wallets

- Implement useBatchApprovals hook for smart wallets
- Add batch approve button in approval modal
- Support both EOA and smart wallet approval flows
- Add proper error handling and success callbacks

Closes #123
```

## 🛠️ Git Hooks

After running `npm run setup-git`, the following hooks are installed:

### Pre-Commit Hook

- Runs ESLint to check code quality
- Validates TypeScript compilation
- Checks Prettier formatting
- Prevents commits with failing checks

### Commit Message Hook

- Validates conventional commit format
- Ensures proper message structure
- Provides helpful error messages

## 🎯 Usage Examples

### Daily Development Workflow

1. **Make changes to your code**
2. **Run auto-commit**:
   ```bash
   npm run auto-commit
   ```
3. **Choose your commit strategy**:
   - Option 1: Commit only staged files
   - Option 2: Stage all and commit
   - Option 3: Write custom message
4. **System validates and commits**

### Quick Commits

```bash
# For small, quick changes
npm run quick-commit

# Or using git alias
git qc
```

### Bulk Changes

```bash
# When you've made many changes
npm run commit-all

# Or using git alias
git ca
```

## 🔧 Configuration

### Commit Message Template

The system uses `.gitmessage` as a template. You can customize it:

```
# <type>: <description>
#
# <body>
#
# <footer>
```

### Git Configuration

The setup script configures:

- Commit message template
- Useful git aliases
- Pre-commit and commit-msg hooks

## 🚨 Troubleshooting

### Common Issues

#### "Not a git repository"

```bash
# Make sure you're in the project root
cd /path/to/evm-incenerator
npm run auto-commit
```

#### "Pre-commit checks failed"

```bash
# Fix linting issues
npm run lint

# Fix TypeScript issues
npx tsc --noEmit

# Fix formatting issues
npx prettier --write .
```

#### "Invalid commit message format"

Use conventional commit format:

```
feat: add new feature
fix: resolve bug
docs: update documentation
```

### Reset Git Hooks

```bash
# Remove existing hooks
rm -rf .git/hooks/pre-commit .git/hooks/commit-msg

# Reinstall hooks
npm run setup-git
```

## 🎉 Benefits

- **Consistent commit messages** across the team
- **Automatic code quality checks** before commits
- **Reduced manual work** with smart categorization
- **Better git history** with conventional commits
- **Faster development workflow** with quick commands
- **Professional commit standards** for open source

## 🔮 Future Enhancements

- [ ] Support for commit scopes (e.g., `feat(components): add new feature`)
- [ ] Integration with issue tracking (automatic issue linking)
- [ ] Commit message templates for different change types
- [ ] Automatic version bumping based on commit types
- [ ] Integration with CI/CD pipelines

---

**Happy Committing! 🚀**

For questions or issues, please refer to the project's main README or open an issue.
