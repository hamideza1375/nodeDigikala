// sprouter
const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');
const AuthMainAdmin = require('../middleware/AuthMainAdmin');
const AuthAllAdmin = require('../middleware/AuthAllAdmin');
const fileUpload = require('../middleware/fileUpload');
const multiFileUpload = require('../middleware/multiFileUpload');


//! get put post delete

router.post('/createCategory', [AuthMainAdmin, fileUpload], AdminController.createCategory);
router.get('/getCategorys',[AuthMainAdmin], AdminController.getCategorys);
router.put('/editCategory/:id', [AuthMainAdmin, fileUpload], AdminController.editCategory);
router.delete('/deleteCategory/:id', AuthMainAdmin, AdminController.deleteCategory);
router.get('/getSinleCategory/:id', AdminController.getSinleCategory);

router.post('/createSeller', AuthMainAdmin, AdminController.createSeller)
router.delete('/deleteSeller/:id', AuthMainAdmin, AdminController.deleteSeller)
router.get('/getAllSellers', AuthMainAdmin, AdminController.getAllSellers)
router.put('/setSellerAvailable/:id', AuthMainAdmin, AdminController.setSellerAvailable)

router.get('/getProductsTable/:id', [AuthMainAdmin], AdminController.getProductsTable);
router.get('/admin/getSingleProduct/:id', [AuthMainAdmin], AdminController.getSingleProduct);
router.post('/createProduct/:id', [AuthMainAdmin, multiFileUpload], AdminController.createProduct);
router.put('/editProduct/:id', [AuthMainAdmin, multiFileUpload], AdminController.editProduct);
router.delete('/deleteProduct/:id', AuthMainAdmin, AdminController.deleteProduct);
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

router.get('/getAllAddress', AuthMainAdmin, AdminController.getAllAddress);
router.get('/getQuitsForSeller', Auth, AdminController.getQuitsForSeller);
router.get('/getDataForChart', Auth, AdminController.getDataForChart);
router.post('/postedOrder/:id', AuthAllAdmin, AdminController.postedOrder);
router.post('/postQueue/:id', AuthAllAdmin, AdminController.postQueue);
router.get('/getAllPaymentSuccessFalseAndTrue', Auth, AdminController.getAllPaymentSuccessFalseAndTrue);

router.post('/sendPostPrice', AuthMainAdmin, AdminController.sendPostPrice);
router.get('/getPostPrice', user, AdminController.getPostPrice);

router.get('/adminTicketBox', AuthMainAdmin, AdminController.adminTicketBox)
router.get('/getAdminTicketSeen', AuthMainAdmin, AdminController.getAdminTicketSeen)

router.post('/createSlider', [AuthMainAdmin, multiFileUpload], AdminController.createSlider)
router.post('/sendQuitForSeller',AuthAllAdmin, AdminController.sendQuitForSeller)

module.exports = router
