// appmid
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/UserModel');


module.exports = async (req, res, next) => {
  const user = jwt.decode(req.header('Authorization'), { complete: true });
  if (!user) return res.status(400).send('شما هنوز ثبت نام نکرده اید')
  const usermodel = await UserModel.findById(user.payload.userId)
  if (!usermodel) return res.status(400).send('شما هنوز ثبت نام نکرده اید')
  req.user = user
  next()
};

//    res.status(200).header("Access-Control-Expose-headers", "Authorization")
 // .header('Authorization', token)