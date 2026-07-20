import config from "../config/index.js";

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const COLORS = { error: "\x1b[31m", warn: "\x1b[33m", info: "\x1b[36m", debug: "\x1b[90m" };
const RESET = "\x1b[0m";

const threshold = LEVELS[config.logLevel] ?? LEVELS.info;

function emit(level, args) {
  if (LEVELS[level] > threshold) return;
  const ts = new Date().toISOString();
  const prefix = `${COLORS[level]}[${level.toUpperCase()}]${RESET} ${ts}`;
  const fn = level === "error" ? console.error : level === "warn" ? console.warn : console.log;
  fn(prefix, ...args);
}

const logger = {
  error: (...args) => emit("error", args),
  warn: (...args) => emit("warn", args),
  info: (...args) => emit("info", args),
  debug: (...args) => emit("debug", args),
};

export default logger;
