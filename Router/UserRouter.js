const express = require('express');
const UserController = require('../Controllers/UserController.js');

const router = express();

router.post('/register', UserController.signUp);
router.get('/getone/:username', UserController.getUser);


module.exports = router;
