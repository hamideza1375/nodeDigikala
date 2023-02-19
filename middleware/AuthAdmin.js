const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    const user = jwt.decode(req.header('Authorization'), {complete:true});
    if(user?.payload?.isAdmin !== 1 ){console.log('شما ادمین نیستید'); return res.status(400).send('')}
    next()
};

//    res.status(200).header("Access-Control-Expose-headers", "Authorization")
 // .header('Authorization', token)