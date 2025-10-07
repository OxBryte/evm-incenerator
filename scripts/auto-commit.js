#!/usr/bin/env node

const { execSync, spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

// ANSI color codes for better console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = "reset") {
  console.log(colorize(message, color));
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
      ...options,
    });
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function getGitStatus() {
  try {
    const status = execCommand("git status --porcelain");
    return status
      .trim()
      .split("\n")
      .filter((line) => line.trim());
  } catch (error) {
    log(
      "Error getting git status. Make sure you are in a git repository.",
      "red",
    );
    process.exit(1);
  }
}

function getStagedFiles() {
  try {
    const staged = execCommand("git diff --cached --name-only");
    return staged
      .trim()
      .split("\n")
      .filter((line) => line.trim());
  } catch (error) {
    return [];
  }
}

function getUnstagedFiles() {
  const status = getGitStatus();
  return status
    .filter(
      (line) =>
        !line.startsWith("A ") &&
        !line.startsWith("M ") &&
        !line.startsWith("D "),
    )
    .map((line) => line.substring(3));
}

function getChangedFiles() {
  const status = getGitStatus();
  return status.map((line) => line.substring(3));
}

function categorizeFiles(files) {
  const categories = {
    components: files.filter(
      (f) => f.includes("/components/") || f.includes("\\components\\"),
    ),
    hooks: files.filter(
      (f) => f.includes("/hooks/") || f.includes("\\hooks\\"),
    ),
    utils: files.filter(
      (f) => f.includes("/utils/") || f.includes("\\utils\\"),
    ),
    constants: files.filter(
      (f) => f.includes("/constants/") || f.includes("\\constants\\"),
    ),
    styles: files.filter(
      (f) => f.endsWith(".css") || f.endsWith(".scss") || f.includes("theme"),
    ),
    config: files.filter(
      (f) =>
        f.includes("config") ||
        f.endsWith(".json") ||
        f.endsWith(".js") ||
        f.endsWith(".ts"),
    ),
    app: files.filter((f) => f.includes("/app/") || f.includes("\\app\\")),
    types: files.filter((f) => f.includes(".d.ts") || f.includes("types")),
    other: [],
  };

  // Find files that don't fit any category
  const categorizedFiles = Object.values(categories).flat();
  categories.other = files.filter((f) => !categorizedFiles.includes(f));

  return categories;
}

function generateCommitMessage(files, isStaged = false) {
  const categories = categorizeFiles(files);
  const prefix = isStaged ? "📦" : "🚀";

  // Count files by category
  const fileCounts = Object.entries(categories)
    .filter(([_, files]) => files.length > 0)
    .map(([category, files]) => `${files.length} ${category}`)
    .join(", ");

  // Determine main change type
  let changeType = "update";
  if (categories.components.length > 0) changeType = "feat";
  if (categories.hooks.length > 0) changeType = "feat";
  if (categories.config.length > 0) changeType = "config";
  if (categories.styles.length > 0) changeType = "style";

  const mainCategory =
    Object.entries(categories).find(([_, files]) => files.length > 0)?.[0] ||
    "files";

  return `${prefix} ${changeType}: ${mainCategory} changes (${fileCounts})`;
}

function runPreCommitChecks() {
  log("\n🔍 Running pre-commit checks...", "blue");

  try {
    // Check if there are any linting errors
    log("  • Running ESLint...", "cyan");
    execCommand("npm run lint", { stdio: "inherit" });
    log("  ✅ ESLint passed", "green");
  } catch (error) {
    log("  ❌ ESLint failed. Please fix the issues before committing.", "red");
    return false;
  }

  // Check TypeScript compilation
  try {
    log("  • Checking TypeScript compilation...", "cyan");
    execCommand("npx tsc --noEmit", { stdio: "pipe" });
    log("  ✅ TypeScript compilation passed", "green");
  } catch (error) {
    log(
      "  ❌ TypeScript compilation failed. Please fix the issues before committing.",
      "red",
    );
    return false;
  }

  return true;
}

function interactiveCommit() {
  const unstagedFiles = getUnstagedFiles();
  const stagedFiles = getStagedFiles();

  if (unstagedFiles.length === 0 && stagedFiles.length === 0) {
    log("📭 No changes to commit.", "yellow");
    return;
  }

  log("\n📋 File Changes Summary:", "blue");

  if (stagedFiles.length > 0) {
    log(`\n✅ Staged files (${stagedFiles.length}):`, "green");
    stagedFiles.forEach((file) => log(`  • ${file}`, "cyan"));
  }

  if (unstagedFiles.length > 0) {
    log(`\n📝 Unstaged files (${unstagedFiles.length}):`, "yellow");
    unstagedFiles.forEach((file) => log(`  • ${file}`, "cyan"));
  }

  // Ask what to commit
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(
      "\n🤔 What would you like to do?\n  [1] Commit staged files only\n  [2] Stage all and commit\n  [3] Custom commit message\n  [4] Cancel\n\nChoice (1-4): ",
      (answer) => {
        rl.close();

        switch (answer.trim()) {
          case "1":
            if (stagedFiles.length === 0) {
              log("❌ No staged files to commit.", "red");
              resolve();
              return;
            }
            commitStagedFiles(stagedFiles);
            break;
          case "2":
            stageAllAndCommit(unstagedFiles, stagedFiles);
            break;
          case "3":
            customCommitMessage();
            break;
          case "4":
            log("👋 Commit cancelled.", "yellow");
            resolve();
            return;
          default:
            log("❌ Invalid choice. Please run the command again.", "red");
            resolve();
            return;
        }
        resolve();
      },
    );
  });
}

function commitStagedFiles(files) {
  if (files.length === 0) {
    log("❌ No staged files to commit.", "red");
    return;
  }

  const message = generateCommitMessage(files, true);
  log(`\n💾 Committing staged files with message: "${message}"`, "blue");

  try {
    execCommand(`git commit -m "${message}"`, { stdio: "inherit" });
    log("✅ Commit successful!", "green");
  } catch (error) {
    log("❌ Commit failed:", "red");
    console.error(error.message);
  }
}

function stageAllAndCommit(unstagedFiles, stagedFiles) {
  if (unstagedFiles.length === 0 && stagedFiles.length === 0) {
    log("📭 No changes to stage and commit.", "yellow");
    return;
  }

  const allFiles = [...unstagedFiles, ...stagedFiles];
  const message = generateCommitMessage(allFiles);

  log(`\n📦 Staging all files...`, "blue");

  try {
    execCommand("git add .", { stdio: "inherit" });
    log("✅ Files staged successfully", "green");

    log(`💾 Committing with message: "${message}"`, "blue");
    execCommand(`git commit -m "${message}"`, { stdio: "inherit" });
    log("✅ Commit successful!", "green");
  } catch (error) {
    log("❌ Commit failed:", "red");
    console.error(error.message);
  }
}

function customCommitMessage() {
  const readline = require("readline");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question("\n✍️  Enter your commit message: ", (message) => {
    rl.close();

    if (!message.trim()) {
      log("❌ Commit message cannot be empty.", "red");
      return;
    }

    log(`\n💾 Committing with custom message: "${message}"`, "blue");

    try {
      execCommand(`git commit -m "${message}"`, { stdio: "inherit" });
      log("✅ Commit successful!", "green");
    } catch (error) {
      log("❌ Commit failed:", "red");
      console.error(error.message);
    }
  });
}

async function main() {
  log(
    colorize("🚀 EVM Incinerator Auto-Commit Tool", "bright") + "\n",
    "magenta",
  );

  // Check if we're in a git repository
  try {
    execCommand("git rev-parse --git-dir", { stdio: "pipe" });
  } catch (error) {
    log(
      "❌ Not a git repository. Please run this command in a git repository.",
      "red",
    );
    process.exit(1);
  }

  // Check for command line arguments
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("\n📖 Auto-Commit Tool Usage:", "blue");
    log("  npm run auto-commit              # Interactive mode");
    log(
      "  npm run auto-commit --quick      # Quick commit with auto-generated message",
    );
    log("  npm run auto-commit --all        # Stage all and commit");
    log("  npm run auto-commit --skip-checks # Skip pre-commit checks");
    log("  npm run auto-commit --help       # Show this help");
    return;
  }

  if (args.includes("--quick")) {
    const unstagedFiles = getUnstagedFiles();
    const stagedFiles = getStagedFiles();

    if (unstagedFiles.length === 0 && stagedFiles.length === 0) {
      log("📭 No changes to commit.", "yellow");
      return;
    }

    const allFiles = [...unstagedFiles, ...stagedFiles];
    const message = generateCommitMessage(allFiles);

    log(`\n⚡ Quick commit mode`, "blue");

    try {
      execCommand("git add .", { stdio: "inherit" });
      execCommand(`git commit -m "${message}"`, { stdio: "inherit" });
      log("✅ Quick commit successful!", "green");
    } catch (error) {
      log("❌ Quick commit failed:", "red");
      console.error(error.message);
    }
    return;
  }

  if (args.includes("--all")) {
    const unstagedFiles = getUnstagedFiles();
    const stagedFiles = getStagedFiles();
    stageAllAndCommit(unstagedFiles, stagedFiles);
    return;
  }

  // Run pre-commit checks (skip if --skip-checks flag is provided)
  if (!args.includes("--skip-checks")) {
    if (!runPreCommitChecks()) {
      log("\n❌ Pre-commit checks failed. Aborting commit.", "red");
      log(
        "💡 Tip: Use --skip-checks flag to bypass pre-commit validation",
        "yellow",
      );
      process.exit(1);
    }
  } else {
    log(
      "\n⚠️  Skipping pre-commit checks (--skip-checks flag detected)",
      "yellow",
    );
  }

  // Interactive mode
  await interactiveCommit();
}

// Handle uncaught errors
process.on("uncaughtException", (error) => {
  log("\n❌ Unexpected error:", "red");
  console.error(error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  log("\n❌ Unhandled promise rejection:", "red");
  console.error(reason);
  process.exit(1);
});

// Run the main function
main().catch((error) => {
  log("\n❌ Auto-commit failed:", "red");
  console.error(error.message);
  process.exit(1);
});
