const router = require('express').Router();
const User = require('../controllers/UserController');
const Auth = require('../middleware/Auth');

//! get put post delete

router.post('/sendCodeRegister', User.sendCodeRegister);
router.post("/verifycodeRegister", User.verifycodeRegister);
router.post('/login', User.login);
router.post('/sendcodeForgetPass', User.sendcodeForgetPass);
router.post("/verifycodeForgetPass", User.verifycodeForgetPass);
router.post('/resetpassword/:id', User.resetPassword);
router.post("/sendproposal", User.sendProposal);
// router.get("/getLastPayment",Auth, User.getLastPayment);
router.get("/captcha.png/:id", User.captcha);

module.exports = router;
