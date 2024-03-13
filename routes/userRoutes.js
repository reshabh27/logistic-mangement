const express = require('express');
const { handleLogin, handleSignup, handleGetMe, handleLogout, handleUpdateProfile, getAllUsers, handleUpdateUserRole, handleDeleteProfile } = require('../controllers/userController');
const { auth } = require('../middleware/auth');




const router = new express.Router();

//  User route for retreiving all users - (Admin only)
router.get('/', auth, getAllUsers);

// User route for SignUp
router.post('/signup', handleSignup);

// User route for Login
router.post('/login', handleLogin);

// User route for getting own Profile
router.get('/profile', auth, handleGetMe);

// User route for updating email, ContactName, phone fields of profile
router.put('/profile', auth, handleUpdateProfile)

// User route for Logout
router.post('/logout', auth, handleLogout);

// User route for updating user role - ( Admin only )
router.put('/:userId/role', auth, handleUpdateUserRole)

// User route for Deleting user profile - ( Admin only )
router.delete('/:userId', auth, handleDeleteProfile)


module.exports = router;