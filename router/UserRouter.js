// sprouter
//appget

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
router.post("/verifycodeForgetPass", user, UserController.verifycodeForgetPass);
router.post('/resetPassword', UserController.resetPassword);
router.post('/resetSpecification', Auth, UserController.resetSpecification);
router.get('/getUserSpecification', Auth, UserController.getUserSpecification);
router.post('/verifycodeResetSpecification', Auth, UserController.verifycodeResetSpecification);
router.post('/sendImageProfile', [Auth, fileUpload], UserController.sendImageProfile);
router.get('/getImageProfile', Auth, UserController.getImageProfile);
router.post("/sendProposal", Auth, UserController.sendProposal);
router.get("/getLastPayment", Auth, UserController.getLastPayment);
router.post("/sendNewTicket", [Auth, fileUpload], UserController.sendNewTicket);
router.get("/ticketBox", Auth, UserController.ticketBox);
router.get("/getAnswersTicket/:id", Auth, UserController.getAnswersTicket);
router.get("/getTicketSeen", user, UserController.getTicketSeen);
router.post("/sendTicketAnswer/:id", [Auth, fileUpload], UserController.sendTicketAnswer);
router.delete("/deleteAnswerTicket/:id", [Auth], UserController.deleteAnswerTicket);
router.delete("/deleteTicket/:id", [Auth], UserController.deleteTicket);
router.put("/editAnswerTicket/:id", [Auth, fileUpload], UserController.editAnswerTicket);
router.get("/getSingleAnswerTicket/:id", [Auth, fileUpload], UserController.getSingleAnswerTicket);
router.post("/ticketSeen/:id", [Auth], UserController.ticketSeen);
router.post("/savedProduct/:id", Auth, UserController.savedProduct);
router.delete("/removeSavedProduct/:id", Auth, UserController.removeSavedProduct);
router.get("/getSavedProducts", Auth, UserController.getSavedProducts);
router.get("/getAllProductForSeller", Auth, UserController.getAllProductForSeller);
router.get("/captcha.png/:id", UserController.captcha);

module.exports = router;
