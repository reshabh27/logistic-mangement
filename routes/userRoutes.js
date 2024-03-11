const express = require('express');
const { handleLogin, handleSignup, handleGetMe } = require('../controllers/userController');
const { auth } = require('../middleware/auth');




const router = new express.Router();



router.post('/signup', handleSignup);
router.post('/login', handleLogin);
router.get('/getme', auth, handleGetMe)


module.exports = router;