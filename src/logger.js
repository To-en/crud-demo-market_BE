
import path from "path";
import { fileURLToPath } from "url";
import dayjs from "dayjs";
import { createLogger, transports, format } from "winston";
import config from "./config.js";

// Define a log level
const customLevel = (level) => {
  switch (true) {
    // Check the received level then replace itself with a pair
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
 * @returns {import("winston").Logger}
 */
// a logger function accept filename , return and saved to specified location
export default (filename) => {
  const label = path.basename(
    filename.startsWith("file://") ? fileURLToPath(filename) : filename,
    ".js",
  );
  return createLogger({
    level: config.log.level,
    format: format.combine(
      format.timestamp(),   
      format.splat(),
      customFormat,
    ),
    defaultMeta: { label },
    transports: [
      // console keeps colors
      new transports.Console({ format: format.combine(format.colorize(), customFormat) }),
      new transports.File({ filename: "logs/combined.log" }),
      new transports.File({ filename: "logs/error.log", level: "error" }),
    ],
  });
};