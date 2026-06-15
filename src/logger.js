
const path = require("path");
const dayjs = require("dayjs");
const { createLogger, transports, format, Logger } = require("winston");
const config = require("./config");

// without '/' it will just revert to it as default
// So this log every request by timestamp in console log


const customLevel = (level) => {
  switch (true) {
    case level.includes("error"):
      return level.replace("error", "ERR");
    case level.includes("warn"):
      return level.replace("warn", "WRN");
    case level.includes("info"):
      return level.replace("info", "INF");
    case level.includes("debug"):
      return level.replace("debug", "DBG");
    default:
      return level;
  }
};

const customFormat = format.printf(({ level, message, label, timestamp }) => {
  timestamp = dayjs(timestamp).format("DD-MM-YYYY HH:mm:ss");
  level = customLevel(level);
  return `${timestamp} ${level} [${label}] ${message}`;
});

/**
 *
 * @param {string} filename
 * @returns {Logger}
 */
module.exports = (filename) => {
  const logger = createLogger({
    level: config.log.level,
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.splat(),
      customFormat,
    ),
    defaultMeta: { label: path.basename(filename, ".js") },
    transports: [new transports.Console()],
  });
  return logger;
};
