const router = require('express').Router();
const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth');
const fileUpload = require('../middleware/fileUpload');

//! get put post delete

router.post('/sendCodeRegister', UserController.sendCodeRegister);
router.post("/verifycodeRegister", UserController.verifycodeRegister);
router.post('/login', UserController.login);
router.post('/verifyCodeLoginForAdmin', UserController.verifyCodeLoginForAdmin);
router.post('/sendCodeForgetPass', UserController.sendCodeForgetPass);
router.post("/verifycodeForgetPass", UserController.verifycodeForgetPass);
router.post('/resetPassword', UserController.resetPassword);
router.post('/sendImageProfile', [Auth, fileUpload], UserController.sendImageProfile);
router.get('/getImageProfile', Auth, UserController.getImageProfile);
router.post("/sendProposal", Auth, UserController.sendProposal);
router.get("/getLastPayment", Auth, UserController.getLastPayment);
router.get("/captcha.png/:id", UserController.captcha);

module.exports = router;
