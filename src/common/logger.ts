import { format, createLogger, transports } from "winston";
const { timestamp, combine, printf, errors, json, metadata, colorize } = format;

function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp, stack, metadata }) => {
    return `${timestamp} ${level}: ${stack || message} ${JSON.stringify(
      metadata,
    )}`;
  });

  return createLogger({
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
      errors({ stack: true }),
      metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
      logFormat,
    ),
    transports: [new transports.Console()],
    level: "debug",
  });
}

function buildProdLogger() {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: "user-service" },
    transports: [new transports.Console()],
  });
}

const logger =
  process.env.NODE_ENV === "DEVELOPMENT" ? buildDevLogger() : buildProdLogger();

export default logger;
