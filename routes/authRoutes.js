const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController.js');



router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports = router;