// appmid
const jwt = require('jsonwebtoken');
const { UserModel } = require('../model/UserModel');


module.exports = async(req, res, next) => {
    const user = jwt.decode(req.header('Authorization'), { complete: true });
    if (!user?.payload?.isAdmin) return res.status(401).send('شما ادمین نیستید')
    const usermodel = await UserModel.findById(user.payload.userId)
    if (!usermodel?.isAdmin) return res.status(401).send('شما ادمین نیستید')
     req.user = user
    next()
};
