const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const Auth = require('../middleware/Auth');
const AuthMainAdmin = require('../middleware/AuthMainAdmin');
const AuthAllAdmin = require('../middleware/AuthAllAdmin');
const fileUpload = require('../middleware/fileUpload');


//! get put post delete

router.post('/createCategory', [AuthMainAdmin, fileUpload], AdminController.createCategory);
router.put('/editCategory/:id', [AuthMainAdmin, fileUpload], AdminController.editCategory);
router.delete('/deleteCategory/:id', AuthMainAdmin, AdminController.deleteCategory);

router.post('/createChildItem/:id', [AuthMainAdmin, fileUpload], AdminController.createChildItem);
router.put('/editChildItem/:id', [AuthMainAdmin, fileUpload], AdminController.editChildItem);
router.delete('/deleteChildItem/:id', AuthMainAdmin, AdminController.deleteChildItem);

router.get('/listUnAvailable', AuthMainAdmin, AdminController.listUnAvailable);
router.post('/changeAvailable/:id', AuthMainAdmin, AdminController.changeAvailable);

router.post('/createNotification', AuthMainAdmin, AdminController.createNotification);
router.delete('/deleteNotification', AuthMainAdmin, AdminController.deleteNotification);

router.post('/setAdmin', AuthMainAdmin, AdminController.setAdmin);
router.delete('/deleteAdmin', AuthMainAdmin, AdminController.deleteAdmin);
router.get('/getAllAdmin', AuthMainAdmin, AdminController.getAllAdmin);
router.put('/changeMainAdmin', AuthMainAdmin, AdminController.changeMainAdmin);

router.get('/getProposal', AuthMainAdmin, AdminController.getProposal);
router.delete('/deleteMultiProposal', AuthMainAdmin, AdminController.deleteMultiProposal);

router.get('/getAllAddress', Auth, AdminController.getAllAddress);
router.delete('/deleteAddressForOneAdmin/:id', AuthAllAdmin, AdminController.deleteAddressForOneAdmin);
router.delete('/deleteAllAddress', AuthMainAdmin, AdminController.deleteAllAddress);
router.post('/sendDisablePost', AuthAllAdmin, AdminController.sendDisablePost);

// priceForPost
router.post('/sendPostPrice', AuthMainAdmin, AdminController.sendPostPrice);
router.get('/getPostPrice', AuthMainAdmin, AdminController.getPostPrice);
// priceForPost

module.exports = router
