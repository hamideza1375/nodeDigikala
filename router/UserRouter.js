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
router.post('/sendImageProfile', [Auth, fileUpload], UserController.sendImageProfile);
router.get('/getImageProfile', Auth, UserController.getImageProfile);
router.post("/sendProposal", Auth, UserController.sendProposal);
router.get("/getLastPayment", Auth, UserController.getLastPayment);
router.post("/sendNewTicket", [Auth, fileUpload], UserController.sendNewTicket);
router.get("/ticketBox", Auth, UserController.ticketBox);
router.get("/getAnswersTicket/:id", Auth, UserController.getAnswersTicket);
router.get("/getTicketSeen", Auth, UserController.getTicketSeen);
router.post("/sendTicketAnswer/:id", [Auth, fileUpload], UserController.sendTicketAnswer);
router.delete("/deleteAnswerTicket/:id", [Auth], UserController.deleteAnswerTicket);
router.delete("/deleteTicket/:id", [Auth], UserController.deleteTicket);
router.put("/editAnswerTicket/:id", [Auth, fileUpload], UserController.editAnswerTicket);
router.get("/getSingleAnswerTicket/:id", [Auth, fileUpload], UserController.getSingleAnswerTicket);
router.post("/ticketSeen/:id", [Auth], UserController.ticketSeen);
router.delete("/deleteMainItemTicketBox/:id", Auth, UserController.deleteMainItemTicketBox);
router.post("/savedItem/:id", Auth, UserController.savedItem);
router.get("/savedItemBox", Auth, UserController.savedItemBox);
router.post("/removeSavedItem/:id", Auth, UserController.removeSavedItem);
router.get("/captcha.png/:id", UserController.captcha);

module.exports = router;
