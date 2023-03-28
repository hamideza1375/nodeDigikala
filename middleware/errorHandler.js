// const winston = require('winston');
// module.exports = (req, res, next) => {
//   process.setMaxListeners(0)
//   winston.add(new winston.transports.File({ filename: 'error-log.log' }));
//   process.on('uncaughtException', (err) => {
//     console.log(err.stack);
//     winston.error(err.message);
//     res.setHeader();
//     process.exit(1)
//   });
//   process.on('unhandledRejection', (err) => {
//     console.log(err.stack);
//     winston.error(err.message);
//     next()
//   });
//   next()
// }
// app.use(errorHandler, Client)
// app.use(errorHandler, User)
// app.use(errorHandler, Admin)

const winston = require("winston");

module.exports = async (error, req, res, next) => {
  console.log(error.stack);
  winston.add(new winston.transports.File({ filename: 'error-log.log' }));
  winston.error(error.message);
  res.status(500).send()
}
