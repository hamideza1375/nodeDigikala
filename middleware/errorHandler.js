const winston = require('winston');

module.exports = (req, res, next) => {
  winston.add(new winston.transports.File({ filename: 'error-log.log' }));
  process.on('uncaughtException', (err) => {
    console.log(err.stack);
    winston.error(err.message);
  });
  process.on('unhandledRejection', (err) => {
    console.log(err.stack);
    winston.error(err.message);
  });
  // next()
}