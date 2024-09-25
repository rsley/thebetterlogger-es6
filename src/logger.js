// Imports \\
import fs from "fs";
import moment from "moment-timezone";
import colors from "colors/safe";

// Functions \\
function removeANSI(logLine) {
  // Remove ANSI Escape Codes
  return logLine.replace(/\[([0-?]*[ -/]*[@-~])/g, "");
}

function clearLogsFolder(folder) {
  fs.rmdirSync(folder, { recursive: true });
  fs.mkdirSync(folder, { recursive: true });
}

// Console Log \\
function consoleLog(level, type, module, text) {
  type = type.charAt(0).toUpperCase() + type.slice(1);
  const colorMap = {
    Info: colors.blue,
    Success: colors.green,
    Error: colors.red,
    Debug: colors.gray,
  };

  const formattedTimestamp = colors.white(
    getCurrentTimestamp("YYYY-MM-DD HH:mm:ss")
  );

  const formattedType = colorMap[type]
    ? colorMap[type](`[ ${type.toUpperCase()} : `)
    : type.toUpperCase();
  const formattedModule = colorMap[type]
    ? colorMap[type](`${module} ]`)
    : module;
  const formattedText = colors.white(text);

  if (level === "info" && type === "Debug") return;

  console.log(
    `${formattedTimestamp} ${formattedType} ${formattedModule} : ${formattedText}`
  );
}

// File Log \\
async function fileLog(level, logFolder, logText) {
  const currentDate = getCurrentTimestamp("DD-MM-YYYY");
  const logFilename = `${logFolder}/${currentDate}.log`;
  logText = removeANSI(logText);
  logText = `\n${logText}`;

  try {
    if (!fs.existsSync(logFilename)) {
      // file is just going to be created
      fs.writeFileSync(
        logFilename,
        `    ┌─────────────────────────────────────────────────────────────────────────────┐
    │         Current Date: ${currentDate}                                            
    │         Program Start: ${getCurrentTimestamp(
      "HH:mm:ss"
    )}                                             
    │         Log Level: ${level}                                                    
    └─────────────────────────────────────────────────────────────────────────────┘\n`
      );
    }
    fs.appendFileSync(logFilename, logText);
  } catch (err) {
    console.error(`Error writing to log file: ${err}`);
  }
}

// Current Timestamp \\
function getCurrentTimestamp(format, tz) {
  return moment()
    .tz(tz || "America/Chicago")
    .format(format);
}

// Delete Today's Log File \\
function deleteToday(tz, logFolder) {
  const currentDate = getCurrentTimestamp("DD-MM-YYYY", tz);
  const logFilePath = `${logFolder}/${currentDate}.log`;

  if (fs.existsSync(logFilePath)) {
    fs.unlinkSync(logFilePath);
    console.log(
      "Debug",
      "Logger",
      `Deleted log file for today: ${currentDate}.log`
    );
  }
}

// Exports \\
export {
  clearLogsFolder,
  consoleLog,
  fileLog,
  getCurrentTimestamp,
  deleteToday,
};
