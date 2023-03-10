// sprouter
const router = require('express').Router();
const ClientController = require('../controllers/ClientController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');


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
router.get('/getChildItemComments/:id', user, ClientController.getChildItemComments);
router.get('/getSingleComment/:id', user, ClientController.getSingleComment);
// comment 
// getNotification
router.get('/getNotification', ClientController.getNotification);
// getNotification
// Geocode
router.post('/reverse', Auth, ClientController.reverse);
router.post('/geocode', Auth, ClientController.geocode);
// Geocode
// Payment 
router.post('/confirmPayment', Auth, ClientController.confirmPayment);
router.get('/verifyPayment', ClientController.verifyPayment);
// Payment 


module.exports = router
