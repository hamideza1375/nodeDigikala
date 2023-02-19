const router = require('express').Router();
const ClientController = require('../controllers/ClientController');
const Auth = require('../middleware/Auth');


//! get put post delete

router.get('/getCategory', ClientController.getCategory);
router.get('/getChildItems/:id', ClientController.getChildItems);
router.get('/getSingleItem/:id', ClientController.getSingleItem);


module.exports = router