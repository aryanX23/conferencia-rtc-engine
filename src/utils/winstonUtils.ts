import winston, { Logger, format } from "winston";
import path from "path";
import fs from "fs";

// Type definitions
interface ErrorMetadata {
	[key: string]: unknown;
}

interface LoggerError extends Error {
	metadata?: ErrorMetadata;
}

interface ErrorInfo extends ErrorMetadata {
	message: string;
	stack?: string;
	timestamp: string;
}

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
	fs.mkdirSync(logsDir, { recursive: true });
}

// Custom format for error handling
const errorFormat = format((info) => {
	if (info instanceof Error) {
		return {
			...info,
			message: info.message,
			stack: info.stack,
			...(info as LoggerError).metadata,
		};
	}
	return info;
});

// Create the logger instance
const logger: Logger = winston.createLogger({
	level: "info",
	format: format.combine(
		errorFormat(),
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.errors({ stack: true }),
		format.splat(),
		format.json()
	),
	defaultMeta: {
		service: "conferencia-rtc-engine",
		environment: process.env.NODE_ENV || "development",
	},
	transports: [
		// Write all logs with level 'error' and below to error.log
		new winston.transports.File({
			filename: path.join(logsDir, "error.log"),
			level: "error",
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			tailable: true,
		}),
		// Write all logs with level 'info' and below to combined.log
		new winston.transports.File({
			filename: path.join(logsDir, "combined.log"),
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			tailable: true,
		}),
	],
});

// If we're not in production, log to the console with custom format
if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: format.combine(
				format.colorize(),
				format.simple(),
				format.printf(({ level, message, timestamp, stack, ...metadata }) => {
					let msg = `${timestamp} ${level}: ${message}`;

					// Add metadata if present
					if (Object.keys(metadata).length > 0) {
						msg += ` ${JSON.stringify(metadata)}`;
					}

					// Add stack trace if present
					if (stack) {
						msg += `\n${stack}`;
					}

					return msg;
				})
			),
		})
	);
}

/**
 * Helper function to log errors with additional context
 * @param error - The error object to log
 * @param additionalContext - Optional additional context to include in the log
 */
const logError = (
	error: Error,
	additionalContext: ErrorMetadata = {}
): void => {
	const errorInfo: ErrorInfo = {
		message: error.message,
		stack: error.stack,
		...additionalContext,
		timestamp: new Date().toISOString(),
	};

	// If error has additional properties, add them to the log
	Object.getOwnPropertyNames(error).forEach((prop) => {
		if (!["stack", "message", "name"].includes(prop)) {
			errorInfo[prop] = error[prop as keyof Error];
		}
	});

	logger.error(errorInfo);

	// In development, also log to console for immediate feedback
	if (process.env.NODE_ENV !== "production") {
		console.error("Error:", error.message);
		console.error("Stack:", error.stack);
	}
};

export { logger, logError };
