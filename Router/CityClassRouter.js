const express = require('express');
const CityClassController = require('../Controllers/CityClassController.js');

const router = express();

router.post('/register', CityClassController.register);
router.post('/deregister', CityClassController.deregister);
router.post('/contactus', CityClassController.contactUs);


module.exports = router;