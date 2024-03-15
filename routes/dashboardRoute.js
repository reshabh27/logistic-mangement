const express = require('express');
const { auth } = require('../middleware/auth');
const { handleAdminDashboard, handleInventoryDashboard } = require('../controllers/dashboardController');
const router = express.Router();


router.get('/', auth, (req, res) => {
    if (req.role === 'Admin')
        return handleAdminDashboard(req, res);
    else
        return res.send("its dashborad but nothing After auth.")
});

router.get('/inventory', (req, res) => {
    if (req.role === 'Admin')
        return handleInventoryDashboard(req, res);
    else
        return res.send("its dashborad but nothing After auth.")
});

// router.get('/inventory', auth, handleInventoryDashboard);


module.exports = router;