const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const user = jwt.decode(req.header('Authorization'), { complete: true });
  req.user = user ? user : {};
  next()
};