const router = require('express').Router();
const ClientController = require('../controllers/ClientController');
const Auth = require('../middleware/Auth');


//! get put post delete

// getItem
router.get('/getCategory', ClientController.getCategory);
router.get('/getChildItems/:id', ClientController.getChildItems);
router.get('/getSingleItem/:id', ClientController.getSingleItem);
// getItem
// comment 
router.post('/createComment/:id', Auth, ClientController.createComment);
router.put('/editComment/:id', Auth, ClientController.editComment);
router.delete('/deleteComment/:id', Auth, ClientController.deleteComment);
// router.get('/getChildItemComments', user, ClientController.getChildItemComments);
// router.get('/getSingleComment/:id', user, ClientController.getSingleComment);
// // comment 
// // getNotification
// router.get('/getNotification', ClientController.getNotification);
// // getNotification
// // imageprofile
// router.post('/sendImageProfile', Auth, ClientController.sendImageProfile);
// router.get('/getImageProfile', user, ClientController.getImageProfile);
// // imageprofile
// // Geocode
// router.post('/reverse', ClientController.reverse);
// router.post('/geocode', ClientController.geocode);
// // Geocode
// // Payment 
// router.post('/confirmPayment', Auth, ClientController.confirmPayment);
// router.get('/verifyPayment', ClientController.verifyPayment);
// // Payment 


module.exports = router
