/**
 * Logger utility for the Skull game server
 * Provides structured logging with different log levels
 */

// Log levels
export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

// Logger configuration
interface LoggerConfig {
  minLevel: LogLevel;
  includeTimestamp: boolean;
}

// Default configuration
const defaultConfig: LoggerConfig = {
  minLevel: LogLevel.INFO,
  includeTimestamp: true,
};

// Current configuration
let config = { ...defaultConfig };

/**
 * Formats a log message with timestamp and level
 * @param level The log level
 * @param message The message to log
 * @param data Additional data to log
 * @returns Formatted log message
 */
function formatLogMessage(
  level: LogLevel,
  message: string,
  ..._data: unknown[]
): string {
  const timestamp = config.includeTimestamp
    ? `[${new Date().toISOString()}] `
    : "";
  return `${timestamp}[${level}] ${message}`;
}

/**
 * Checks if a log level should be displayed based on the minimum level
 * @param level The log level to check
 * @returns True if the log should be displayed
 */
function shouldLog(level: LogLevel): boolean {
  const levels = Object.values(LogLevel);
  const minLevelIndex = levels.indexOf(config.minLevel);
  const currentLevelIndex = levels.indexOf(level);
  return currentLevelIndex >= minLevelIndex;
}

/**
 * Configures the logger
 * @param newConfig The new configuration
 */
export function configureLogger(newConfig: Partial<LoggerConfig>): void {
  config = { ...config, ...newConfig };
}

/**
 * Debug level logging
 * @param message The message to log
 * @param data Additional data to log
 */
export function debug(message: string, ...data: unknown[]): void {
  if (shouldLog(LogLevel.DEBUG)) {
    console.debug(formatLogMessage(LogLevel.DEBUG, message), ...data);
  }
}

/**
 * Info level logging
 * @param message The message to log
 * @param data Additional data to log
 */
export function info(message: string, ...data: unknown[]): void {
  if (shouldLog(LogLevel.INFO)) {
    console.info(formatLogMessage(LogLevel.INFO, message), ...data);
  }
}

/**
 * Warning level logging
 * @param message The message to log
 * @param data Additional data to log
 */
export function warn(message: string, ...data: unknown[]): void {
  if (shouldLog(LogLevel.WARN)) {
    console.warn(formatLogMessage(LogLevel.WARN, message), ...data);
  }
}

/**
 * Error level logging
 * @param message The message to log
 * @param data Additional data to log
 */
export function error(message: string, ...data: unknown[]): void {
  if (shouldLog(LogLevel.ERROR)) {
    console.error(formatLogMessage(LogLevel.ERROR, message), ...data);
  }
}

// Export a default logger object for convenience
export const logger = {
  debug,
  info,
  warn,
  error,
  configureLogger,
};

export default logger;
