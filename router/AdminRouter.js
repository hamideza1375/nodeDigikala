const router = require('express').Router();
const AdminController = require('../controllers/AdminController');
const user = require('../middleware/user');
const AuthAdmin = require('../middleware/AuthAdmin');

//! get put post delete

router.post('/createCategory', AdminController.createCategory);
router.put('/editCategory/:id', AdminController.editCategory);
router.delete('/deleteCategory/:id', AdminController.deleteCategory);

router.post('/createChildItem/:id', AdminController.createChildItem);
router.put('/editChildItem/:id', AdminController.editChildItem);
router.delete('/deleteChildItem/:id', AdminController.deleteChildItem);

router.get('/listUnAvailable', AdminController.listUnAvailable);
router.post('/changeAvailable/:id', AdminController.changeAvailable);

router.post('/createNotification', AdminController.createNotification);

router.post('/setAdmin', AdminController.setAdmin);
router.delete('/deleteAdmin', AdminController.deleteAdmin);
router.get('/getAllAdmin', AdminController.getAllAdmin);
router.put('/changeMainAdmin', AdminController.changeMainAdmin);


router.get('/getProposal', AdminController.getProposal);
router.delete('/deleteMultiProposal', AdminController.deleteMultiProposal);
router.post('/senddisablePayment', AdminController.senddisablePayment);
router.delete('/deleteAddress', AdminController.deleteAddress);
router.delete('/deleteAllAddress', AdminController.deleteAllAddress);


module.exports = router
