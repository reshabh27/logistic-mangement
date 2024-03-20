const express = require('express');
const { auth } = require('../middleware/auth');
// const { handleAdminDashboard, handleInventoryDashboard } = require('../controllers/dashboardController');

const {
  handleAdminDashboard,
  handleOrderDashboard,
  handleTransportDashboard,
  handleInventoryDashboard
} = require("../controllers/dashboardController");
const router = express.Router();

router.get("/", auth, (req, res) => {
  if (req.role === "Admin") return handleAdminDashboard(req, res);
  else return res.send("its dashborad but nothing After auth.");
});
router.get("/orderDashboard", handleOrderDashboard);
router.get("/transportDashboard", handleTransportDashboard);

router.get('/', auth, (req, res) => {
    if (req.role === 'Admin')
        return handleAdminDashboard(req, res);
    else
        return res.send("its dashborad but nothing After auth.")
});

// router.get('/inventory', auth, (req, res) => {
//     if (req.role === 'Admin'){
//       console.log('I am here')
//       return handleInventoryDashboard(req, res);
//     }
//     else {
//       // console.log('I am here')
//       return res.send("its dashborad but nothing After auth.")
//     }
// });

router.get('/inventory', auth, handleInventoryDashboard)

// router.get('/inventory', auth, handleInventoryDashboard);


module.exports = router;

