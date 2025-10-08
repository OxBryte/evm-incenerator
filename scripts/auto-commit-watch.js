#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function log(message, color = "reset") {
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `${colorize(`[${timestamp}]`, "dim")} ${colorize(message, color)}`,
  );
}

function execCommand(command, options = {}) {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: "pipe",
      ...options,
    });
  } catch (error) {
    return null;
  }
}

function getGitStatus() {
  try {
    const status = execCommand("git status --porcelain");
    if (!status) return [];
    return status
      .trim()
      .split("\n")
      .filter((line) => line.trim());
  } catch (error) {
    return [];
  }
}

function hasChanges() {
  const status = getGitStatus();
  return status.length > 0;
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
    views: files.filter(
      (f) => f.includes("/views/") || f.includes("\\views\\"),
    ),
    scripts: files.filter(
      (f) => f.includes("/scripts/") || f.includes("\\scripts\\"),
    ),
    provider: files.filter(
      (f) => f.includes("/provider/") || f.includes("\\provider\\"),
    ),
    types: files.filter((f) => f.includes(".d.ts") || f.includes("types")),
    other: [],
  };

  // Find files that don't fit any category
  const categorizedFiles = Object.values(categories).flat();
  categories.other = files.filter((f) => !categorizedFiles.includes(f));

  return categories;
}

function generateCommitMessage(files) {
  const categories = categorizeFiles(files);

  // Count files by category
  const fileCounts = Object.entries(categories)
    .filter(([_, files]) => files.length > 0)
    .map(([category, files]) => `${files.length} ${category}`)
    .join(", ");

  // Determine main change type
  let changeType = "chore";
  if (categories.components.length > 0) changeType = "feat";
  if (categories.hooks.length > 0) changeType = "feat";
  if (categories.config.length > 0) changeType = "config";
  if (categories.styles.length > 0) changeType = "style";
  if (categories.scripts.length > 0) changeType = "chore";

  const mainCategory =
    Object.entries(categories).find(([_, files]) => files.length > 0)?.[0] ||
    "files";

  const timestamp = new Date().toLocaleString();

  return `${changeType}: auto-save ${mainCategory} (${fileCounts}) - ${timestamp}`;
}

function performAutoCommit() {
  if (!hasChanges()) {
    return false;
  }

  const status = getGitStatus();
  const files = status.map((line) => line.substring(3));
  const message = generateCommitMessage(files);

  try {
    // Stage all changes
    execCommand("git add .", { stdio: "pipe" });

    // Commit
    execCommand(`git commit -m "${message}"`, { stdio: "pipe" });

    log(`✅ Auto-committed: ${files.length} file(s)`, "green");
    log(`   Message: ${message}`, "cyan");

    return true;
  } catch (error) {
    log(`❌ Commit failed: ${error.message}`, "red");
    return false;
  }
}

let commitCount = 0;
let isRunning = true;

function watchAndCommit(intervalSeconds = 5) {
  log(
    colorize("🚀 EVM Incinerator Auto-Commit Watch Started", "bright"),
    "magenta",
  );
  log(`⏱️  Checking for changes every ${intervalSeconds} seconds...`, "blue");
  log(`📁 Working directory: ${process.cwd()}`, "dim");
  log(`⚠️  Press Ctrl+C to stop`, "yellow");
  log("━".repeat(60), "dim");

  const interval = setInterval(() => {
    if (!isRunning) {
      clearInterval(interval);
      return;
    }

    const committed = performAutoCommit();
    if (committed) {
      commitCount++;
      log(`📊 Total commits: ${commitCount}`, "blue");
      log("━".repeat(60), "dim");
    }
  }, intervalSeconds * 1000);

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    log("\n🛑 Stopping auto-commit watch...", "yellow");
    isRunning = false;
    clearInterval(interval);

    // Perform one final commit if there are changes
    if (hasChanges()) {
      log("📝 Performing final commit...", "blue");
      performAutoCommit();
    }

    log(`\n✨ Total commits made: ${commitCount}`, "green");
    log("👋 Auto-commit watch stopped", "cyan");
    process.exit(0);
  });
}

function main() {
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

  // Parse command line arguments
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    log("\n📖 Auto-Commit Watch Usage:", "blue");
    log(
      "  npm run watch-commit              # Watch and commit every 5 seconds",
    );
    log("  npm run watch-commit -- --interval 10  # Custom interval (seconds)");
    log("  npm run watch-commit -- --help    # Show this help");
    return;
  }

  // Get interval from arguments
  let interval = 5; // default 5 seconds
  const intervalIndex = args.indexOf("--interval");
  if (intervalIndex !== -1 && args[intervalIndex + 1]) {
    const customInterval = parseInt(args[intervalIndex + 1], 10);
    if (!isNaN(customInterval) && customInterval > 0) {
      interval = customInterval;
    } else {
      log("⚠️  Invalid interval, using default 5 seconds", "yellow");
    }
  }

  // Start watching
  watchAndCommit(interval);
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
main();
