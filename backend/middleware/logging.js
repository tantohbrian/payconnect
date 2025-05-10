const morgan = require('morgan');
const winston = require('winston');

// Create a Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

// Create a Morgan middleware with a custom format
const loggingMiddleware = morgan(':method :url :status :res[content-length] - :response-time ms', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
});

module.exports = loggingMiddleware;
