// appmid
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
  const user = jwt.decode(req.header('Authorization'), { complete: true });
  if (!user) return res.status(400).send('شما هنوز ثبت نام نکرده اید')
  else {
  req.user = user
  next()
}};

//    res.status(200).header("Access-Control-Expose-headers", "Authorization")
 // .header('Authorization', token)