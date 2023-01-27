const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logFormat = format.combine(
  format.timestamp({ format: () => new Date().toString() }),
  format.metadata(),
  format.json()
);

const logger = createLogger({
  format: format.json(),
  transports: [
    new transports.Console({ format: format.simple(), level: "silly" }),
    new transports.File({
      filename: "./logging/error.log",
      level: "error",
      format: logFormat,
    }),
    new transports.File({
      filename: "./logging/combined.log",
      level: "info",
      format: logFormat,
    }),
  ],
  exceptionHandlers: [
    new transports.Console({ format: format.simple() }),
    new transports.File({
      filename: "./logging/exceptions.log",
    }),
  ],
  rejectionHandlers: [
    new transports.Console({ format: format.simple() }),
    new transports.File({
      filename: "./logging/rejections.log",
    }),
  ],
});

module.exports = logger;
module.exports.addMongoDBTransport = async function (dbUrl) {
  this.add(
    new transports.MongoDB({
      format: logFormat,
      name: "taskitLogger",
      db: dbUrl,
      level: "error",
      tryReconnect: true,
      collection: "logs",
      options: {
        poolSize: 2,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      },
    })
  );
};
