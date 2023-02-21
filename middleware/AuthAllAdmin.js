const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const user = jwt.decode(req.header('Authorization'), { complete: true });
    if (!user?.payload?.isAdmin) return res.status(400).send('شما ادمین نیستید')
    req.user = user
    next()
};
