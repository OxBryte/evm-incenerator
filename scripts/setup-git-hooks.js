#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  blue: "\x1b[34m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = "reset") {
  console.log(colorize(message, color));
}

function setupGitHooks() {
  const hooksDir = path.join(process.cwd(), ".git", "hooks");
  const scriptsDir = path.join(process.cwd(), "scripts");

  // Check if .git/hooks directory exists
  if (!fs.existsSync(hooksDir)) {
    log(
      "❌ Git hooks directory not found. Make sure you are in a git repository.",
      "red",
    );
    process.exit(1);
  }

  // Create pre-commit hook (disabled by default)
  const preCommitHook = `#!/bin/sh
# Pre-commit hook for EVM Incinerator
# This hook is DISABLED by default to allow quick commits
# Uncomment the lines below to enable pre-commit checks

# echo "🔍 Running pre-commit checks..."

# # Run ESLint
# echo "  • Running ESLint..."
# npm run lint
# if [ $? -ne 0 ]; then
#   echo "❌ ESLint failed. Please fix the issues before committing."
#   echo "💡 Tip: Use 'npm run commit-skip' to bypass checks"
#   exit 1
# fi

# # Run TypeScript check
# echo "  • Checking TypeScript compilation..."
# npx tsc --noEmit
# if [ $? -ne 0 ]; then
#   echo "❌ TypeScript compilation failed. Please fix the issues before committing."
#   echo "💡 Tip: Use 'npm run commit-skip' to bypass checks"
#   exit 1
# fi

# # Run Prettier check
# echo "  • Checking code formatting..."
# npx prettier --check .
# if [ $? -ne 0 ]; then
#   echo "❌ Code formatting check failed. Run 'npx prettier --write .' to fix formatting issues."
#   echo "💡 Tip: Use 'npm run commit-skip' to bypass checks"
#   exit 1
# fi

# echo "✅ All pre-commit checks passed!"
echo "⚠️  Pre-commit checks are disabled. Use 'npm run commit-skip' to commit without checks."
`;

  // Create commit-msg hook for conventional commits (disabled by default)
  const commitMsgHook = `#!/bin/sh
# Commit message hook for conventional commits
# This hook is DISABLED by default to allow any commit message format
# Uncomment the lines below to enable commit message validation

# commit_regex='^(feat|fix|docs|style|refactor|perf|test|chore|config|deps)(\\(.+\\))?: .{1,50}'

# if ! grep -qE "$commit_regex" "$1"; then
#     echo "❌ Invalid commit message format!"
#     echo ""
#     echo "Please use conventional commit format:"
#     echo "  <type>: <description>"
#     echo ""
#     echo "Types: feat, fix, docs, style, refactor, perf, test, chore, config, deps"
#     echo "Example: feat: add batch approval for EOA wallets"
#     echo ""
#     exit 1
# fi

echo "⚠️  Commit message validation is disabled. Any message format is allowed."
`;

  try {
    // Write pre-commit hook
    const preCommitPath = path.join(hooksDir, "pre-commit");
    fs.writeFileSync(preCommitPath, preCommitHook);
    execSync(`chmod +x "${preCommitPath}"`);
    log("✅ Pre-commit hook installed", "green");

    // Write commit-msg hook
    const commitMsgPath = path.join(hooksDir, "commit-msg");
    fs.writeFileSync(commitMsgPath, commitMsgHook);
    execSync(`chmod +x "${commitMsgPath}"`);
    log("✅ Commit message hook installed", "green");

    log("\n🎉 Git hooks setup complete!", "blue");
    log("The following hooks have been installed:", "blue");
    log(
      "  • pre-commit: DISABLED by default (can be enabled by uncommenting)",
      "blue",
    );
    log(
      "  • commit-msg: DISABLED by default (can be enabled by uncommenting)",
      "blue",
    );
    log("  • Both hooks allow commits without validation", "blue");
  } catch (error) {
    log(`❌ Failed to setup git hooks: ${error.message}`, "red");
    process.exit(1);
  }
}

function setupGitConfig() {
  try {
    // Set up commit message template
    execSync("git config commit.template .gitmessage");
    log("✅ Git commit template configured", "green");

    // Set up some useful git aliases
    execSync('git config alias.ac "!npm run auto-commit"');
    execSync('git config alias.qc "!npm run quick-commit"');
    execSync('git config alias.ca "!npm run commit-all"');

    log("✅ Git aliases configured:", "green");
    log("  • git ac = npm run auto-commit", "blue");
    log("  • git qc = npm run quick-commit", "blue");
    log("  • git ca = npm run commit-all", "blue");
  } catch (error) {
    log(
      `⚠️  Warning: Could not configure git settings: ${error.message}`,
      "yellow",
    );
  }
}

function main() {
  log(
    colorize("🚀 Setting up Git Hooks for EVM Incinerator", "green") + "\n",
    "blue",
  );

  setupGitHooks();
  setupGitConfig();

  log("\n🎯 You can now use:", "blue");
  log("  npm run auto-commit     # Interactive commit mode", "blue");
  log(
    "  npm run quick-commit    # Quick commit with auto-generated message",
    "blue",
  );
  log("  npm run commit-all      # Stage all and commit", "blue");
  log("  git ac                  # Same as npm run auto-commit", "blue");
  log("  git qc                  # Same as npm run quick-commit", "blue");
  log("  git ca                  # Same as npm run commit-all", "blue");
}

main();
