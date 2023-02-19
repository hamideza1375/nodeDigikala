const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const Auth = require('../middleware/Auth');
const AuthAdmin = require('../middleware/AuthAdmin');


//! get put post delete

router.post('/createCategory', AuthAdmin, AdminController.createCategory);
router.put('/editCategory/:id', AuthAdmin, AdminController.editCategory);
router.delete('/deleteCategory/:id', AuthAdmin, AdminController.deleteCategory);

router.post('/createChildItem/:id', AuthAdmin, AdminController.createChildItem);
router.put('/editChildItem/:id', AuthAdmin, AdminController.editChildItem);
router.delete('/deleteChildItem/:id', AuthAdmin, AdminController.deleteChildItem);

router.get('/listUnAvailable', AuthAdmin, AdminController.listUnAvailable);
router.post('/changeAvailable/:id', AuthAdmin, AdminController.changeAvailable);

router.post('/createNotification', AuthAdmin, AdminController.createNotification);

router.post('/setAdmin', AuthAdmin, AdminController.setAdmin);
router.delete('/deleteAdmin', AuthAdmin, AdminController.deleteAdmin);
router.get('/getAllAdmin', AuthAdmin, AdminController.getAllAdmin);
router.put('/changeMainAdmin', AuthAdmin, AdminController.changeMainAdmin);


router.get('/getProposal', AuthAdmin, AdminController.getProposal);
router.delete('/deleteMultiProposal', AuthAdmin, AdminController.deleteMultiProposal);

router.get('/getAllAddress', Auth, AdminController.getAllAddress);
router.delete('/deleteAddressForOneAdmin/:id', Auth, AdminController.deleteAddressForOneAdmin);
router.delete('/deleteAllAddress', AuthAdmin, AdminController.deleteAllAddress);
router.post('/sendDisablePost', Auth, AdminController.sendDisablePost);

// priceForPost
router.post('/sendPostPrice',AuthAdmin, AdminController.sendPostPrice);
router.get('/getPostPrice', AuthAdmin, AdminController.getPostPrice);
// priceForPost

module.exports = router
