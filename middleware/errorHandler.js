const winston = require('winston');

module.exports = (req, res, next) => {
  winston.add(new winston.transports.File({ filename: 'error-log.log' }));
  process.on('uncaughtException', (err) => {
    console.log(err);
    res.status(400).send('خطایی غیر منتظره رخ داد')
    winston.error(err.message);
  });
  process.on('unhandledRejection', (err) => {
    console.log(err);
    res.status(400).send('خطایی غیر منتظره رخ داد')
    winston.error(err.message);
  });
  next()
}