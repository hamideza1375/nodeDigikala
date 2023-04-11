// appmid
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/UserModel');


module.exports = async (req, res, next) => {
  const user = jwt.decode(req.header('Authorization'), { complete: true });
  const usermodel = await UserModel.findById(user?.payload?.userId)
  if (usermodel) {
    req.user = user
    next()
  }
  else {
    req.user = {};
    next()
  }
};