// Imports \\
import fs from "fs";
import {
  clearLogsFolder,
  consoleLog,
  fileLog,
  getCurrentTimestamp,
  deleteToday,
} from "./logger.js";

// Class \\
class Logger {
  /*
   * Constructor for the Logger class
   * @param {string} level - The log level
   * @param {string} timezone - The timezone
   * @param {string} logFolder - The log folder FULL PATH
   */
  constructor(level, timezone, logFolder) {
    this.level = level;
    this.timezone = timezone;
    this.logFolder = logFolder;

    if (!fs.existsSync(logFolder)) {
      fs.mkdirSync(logFolder, { recursive: true });
    }
  }

  log(type, module, text) {
    const timestamp = getCurrentTimestamp("DD-MM-YYYY HH:mm:ss", this.timezone);
    const logText = `[${timestamp}] [${type.toUpperCase()}] [${module.toUpperCase()}] : ${text}`;

    consoleLog(this.level, type, module, text);
    fileLog(this.level, this.logFolder, logText);
  }

  clearLogs() {
    clearLogsFolder(this.logFolder);
  }

  deleteToday() {
    deleteToday(this.timezone, this.logFolder);
  }
}

// Exports \\
export default Logger;
