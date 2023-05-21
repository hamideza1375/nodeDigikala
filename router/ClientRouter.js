// sprouter
const router = require('express').Router();
const ClientController = require('../controllers/ClientController');
const Auth = require('../middleware/Auth');
const user = require('../middleware/user');

//! get put post delete
router.get('/getSlider', ClientController.getSlider);
router.get('/getCategory', ClientController.getCategory);
router.get('/getProducts/:id', ClientController.getProducts);
router.get('/getSingleProduct/:id', ClientController.getSingleProduct);
router.get('/getOffers', ClientController.getOffers);
router.get('/getPopulars', ClientController.getPopulars);
router.get('/getSimilars/:id', ClientController.getSimilars);

router.post('/createComment/:id', Auth, ClientController.createComment);
router.put('/editComment/:id', Auth, ClientController.editComment);
router.delete('/deleteComment/:id', Auth, ClientController.deleteComment);
router.get('/getProductComments/:id', user, ClientController.getProductComments);
router.get('/getSingleComment/:id', user, ClientController.getSingleComment);
router.get('/getSingleCommentAnswer/:id', user, ClientController.getSingleCommentAnswer);
router.post('/commentLike/:id', Auth, ClientController.commentLike);
router.post('/commentDisLike/:id', Auth, ClientController.commentDisLike);

router.post('/createCommentAnswer/:id', [Auth], ClientController.createCommentAnswer);
router.put('/editCommentAnswer/:id', [Auth], ClientController.editCommentAnswer);
router.delete('/deleteCommentAnswer/:id', [Auth], ClientController.deleteCommentAnswer);
router.post('/likeAnswer/:id', Auth, ClientController.likeAnswer);
router.post('/disLikeAnswer/:id', Auth, ClientController.disLikeAnswer);

router.get('/getNotification', ClientController.getNotification);

router.post('/reverse', Auth, ClientController.reverse);
router.post('/geocode', Auth, ClientController.geocode);

router.post('/confirmPayment', Auth, ClientController.confirmPayment);
router.get('/verifyPayment', ClientController.verifyPayment);

router.post('/addBuyBasket/:id', ClientController.addBuyBasket);
router.get('/getAddress', user, ClientController.getAddress);
router.get('/getSingleSeller', ClientController.getSingleSeller);
router.get('/getSendStatus', ClientController.getSendStatus);

router.get("/getSingleSavedsavedProducts/:id", user, ClientController.getSingleSavedsavedProducts);
router.get('/allProduct', ClientController.allProduct);

module.exports = router
