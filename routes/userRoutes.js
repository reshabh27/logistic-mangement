const express = require('express');
const { handleLogin, handleSignup, handleGetMe, handleLogout } = require('../controllers/userController');
const { auth } = require('../middleware/auth');




const router = new express.Router();



router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/getme', auth, handleGetMe);
router.post('/logout', auth, handleLogout)


module.exports = router;