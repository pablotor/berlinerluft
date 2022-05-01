import { createLogger, format, transports } from 'winston';

/**
 * From winston quickstart example.Check more about how to use it:
 * https://github.com/winstonjs/winston/blob/master/examples/quick-start.js
 */

const appName = process.env.npm_package_name || 'myApp';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: appName },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({
      filename: `logs/${appName}-error.log`,
      level: 'error',
    }),
    new transports.File({
      filename: `logs/${appName}-combined.log`,
    }),
  ],
});

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.combine(
      format.colorize(),
      format.simple(),
    ),
  }));
}

export default logger;
