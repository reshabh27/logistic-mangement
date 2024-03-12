const express = require('express');
const { handleLogin, handleSignup, handleGetMe, handleLogout, handleUpdateProfile, getAllUsers, handleUpdateUserRole, handleDeleteProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');




const router = new express.Router();


router.get('/', auth, getAllUsers);

router.post('/signup', handleSignup);

router.post('/login', handleLogin);

router.get('/profile', auth, handleGetMe);
router.put('/profile', auth, handleUpdateProfile)

router.post('/logout', auth, handleLogout);

router.put('/:userId/role', auth, handleUpdateUserRole)

router.delete('/:userId', auth, handleDeleteProfile)


module.exports = router;