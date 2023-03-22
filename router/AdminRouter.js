// sprouter
const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const Auth = require('../middleware/Auth');
const AuthMainAdmin = require('../middleware/AuthMainAdmin');
const AuthAllAdmin = require('../middleware/AuthAllAdmin');
const fileUpload = require('../middleware/fileUpload');
const multiFileUpload = require('../middleware/multiFileUpload');


//! get put post delete

router.post('/createCategory/:id', [AuthMainAdmin, fileUpload], AdminController.createCategory);
router.get('/getCategory/:id',[AuthMainAdmin], AdminController.getCategory);
router.put('/editCategory/:id', [AuthMainAdmin, fileUpload], AdminController.editCategory);
router.delete('/deleteCategory/:id', AuthMainAdmin, AdminController.deleteCategory);
router.get('/getSinleCategory/:id', AdminController.getSinleCategory);


router.post('/createChildItem/:id', [AuthMainAdmin, multiFileUpload], AdminController.createChildItem);
router.put('/editChildItem/:id', [AuthMainAdmin, multiFileUpload], AdminController.editChildItem);
router.delete('/deleteChildItem/:id', AuthMainAdmin, AdminController.deleteChildItem);
router.post('/setOffer/:id', AuthMainAdmin, AdminController.setOffer);

router.get('/listUnAvailable', AuthMainAdmin, AdminController.listUnAvailable);
router.post('/changeAvailable/:id', AuthMainAdmin, AdminController.changeAvailable);

router.post('/createNotification', AuthMainAdmin, AdminController.createNotification);
router.delete('/deleteNotification', AuthMainAdmin, AdminController.deleteNotification);

router.post('/setAdmin', AuthMainAdmin, AdminController.setAdmin);
router.delete('/deleteAdmin', AuthMainAdmin, AdminController.deleteAdmin);
router.get('/getAllAdmin', AuthMainAdmin, AdminController.getAllAdmin);
router.put('/changeMainAdmin', AuthMainAdmin, AdminController.changeMainAdmin);

router.get('/getProposal', AuthMainAdmin, AdminController.getProposal);
router.post('/deleteMultiProposal', AuthMainAdmin, AdminController.deleteMultiProposal);

router.get('/getAllAddress', Auth, AdminController.getAllAddress);
router.get('/getAllAddressForChart', Auth, AdminController.getAllAddressForChart);
router.post('/postedOrder/:id', AuthAllAdmin, AdminController.postedOrder);
router.post('/postQueue/:id', AuthAllAdmin, AdminController.postQueue);
router.post('/sendDisablePost', AuthAllAdmin, AdminController.sendDisablePost);
router.get('/getAllPaymentSuccessFalseAndTrue', Auth, AdminController.getAllPaymentSuccessFalseAndTrue);

// priceForPost
router.post('/sendPostPrice', AuthMainAdmin, AdminController.sendPostPrice);
router.get('/getPostPrice', AuthMainAdmin, AdminController.getPostPrice);
// priceForPost

router.get('/adminTicketBox', AuthMainAdmin, AdminController.adminTicketBox)

router.post('/createSeller', AuthMainAdmin, AdminController.createSeller)
router.delete('/deleteSeller/:id', AuthMainAdmin, AdminController.deleteSeller)
router.get('/getAllSellers', AuthMainAdmin, AdminController.getAllSellers)
router.put('/setSellerAvailable/:id', AuthMainAdmin, AdminController.setSellerAvailable)


router.get('/getAllUser', AuthMainAdmin, AdminController.getAllUser)
router.post('/createSlider', AuthMainAdmin, AdminController.createSlider)

module.exports = router
