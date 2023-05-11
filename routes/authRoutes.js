const { Router } = require('express');
const router = Router();
const authController = require('../controller/authController.js');
const { auth } = require('../middleware/authMiddleware.js');



router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', auth, authController.logout);

module.exports = router;