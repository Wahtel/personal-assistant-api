import fs from 'fs';
import util from 'util';
import path from 'path';

import { createLogger, transports, format, config } from 'winston';

const logsDirectory = path.join(process.cwd(), 'logs');

// Create logs directory if it doesn't exist yet
if (!fs.existsSync(logsDirectory)) fs.mkdirSync(logsDirectory);

const winstonTransports = [
  new transports.File({
    level: 'info',
    filename: `${logsDirectory}/all-logs.log`,
    maxsize: 5242880,
    maxFiles: 5
  }),
  new transports.File({
    level: 'error',
    filename: `${logsDirectory}/exceptions.log`,
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 5
  }),
  new transports.Console({
    level: 'info',
    handleExceptions: true,
    format: format.combine(format.colorize(), format.simple())
  })
];

const logger = createLogger({
  transports: winstonTransports,
  levels: config.syslog.levels,
  exitOnError: false
});

/**
 * Log info entry
 * @param message
 * @param moduleName
 * @param meta
 */
export function info(message, moduleName = '', meta = {}) {
  logger.info(buildLoggerMessage(message, moduleName), meta);
}

/**
 * Log error entry
 * @param message
 * @param moduleName
 * @param meta
 */
export function error(message, moduleName = '', meta = {}) {
  logger.error(buildLoggerMessage(message, moduleName), meta);
}

/**
 * Log critical entry
 * @param message
 * @param moduleName
 * @param meta
 */
export function critical(message, moduleName = '', meta = {}) {
  logger.crit(buildLoggerMessage(message, moduleName), meta);
}

/**
 * Deeper inspect in the same import as logger
 * @param obj
 * @param depth
 */
export function inspect(obj, depth = 4) {
  return util.inspect(obj, { showHidden: false, depth });
}

/**
 * Build logger message
 * @param message
 * @param moduleName
 */
function buildLoggerMessage(message, moduleName) {
  let result = '';

  if (moduleName) result += `[${moduleName}]: `;

  result += message;

  return result;
}
