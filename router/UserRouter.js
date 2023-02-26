const router = require('express').Router();
const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');
const fileUpload = require('../middleware/fileUpload');

//! get put post delete

router.post('/getCodeForRegister', user, UserController.getCodeForRegister);
router.post('/getNewCode', user, UserController.getNewCode);
router.post("/verifycodeRegister", UserController.verifycodeRegister);
router.post('/login', user, UserController.login);
router.post('/verifyCodeLoginForAdmin', UserController.verifyCodeLoginForAdmin);
router.post('/getCodeForgetPass', user, UserController.getCodeForgetPass);
router.post("/verifycodeForgetPass", UserController.verifycodeForgetPass);
router.post('/resetPassword', UserController.resetPassword);
router.post('/sendImageProfile', [Auth, fileUpload], UserController.sendImageProfile);
router.get('/getImageProfile', Auth, UserController.getImageProfile);
router.post("/sendProposal", Auth, UserController.sendProposal);
router.get("/getLastPayment", Auth, UserController.getLastPayment);
router.post("/sendNewTicket", [Auth, fileUpload], UserController.sendNewTicket);
router.get("/ticketBox", Auth, UserController.ticketBox);
router.get("/singleTicket/:id", Auth, UserController.singleTicket);
router.post("/ticketAnswer/:id", Auth, UserController.ticketAnswer);
router.post("/savedItem/:id", Auth, UserController.savedItem);
router.get("/savedItemBox", Auth, UserController.savedItemBox);
router.post("/removeSavedItem/:id", Auth, UserController.removeSavedItem);
router.get("/captcha.png/:id", UserController.captcha);

module.exports = router;
