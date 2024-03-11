const express = require('express');
const { handleLogin, handleSignup, handleGetMe, handleLogout, handleUpdateProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');




const router = new express.Router();



router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/profile', auth, handleGetMe);
router.put('/profile', auth, handleUpdateProfile)
router.post('/logout', auth, handleLogout);



module.exports = router;