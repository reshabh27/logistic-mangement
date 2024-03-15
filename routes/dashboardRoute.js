const express = require("express");
const { auth } = require("../middleware/auth");
const {
  handleAdminDashboard,
  handleOrderDashboard,
  handleTransportDashboard,
} = require("../controllers/dashboardController");
const router = express.Router();

router.get("/", auth, (req, res) => {
  if (req.role === "Admin") return handleAdminDashboard(req, res);
  else return res.send("its dashborad but nothing After auth.");
});
router.get("/orderDashboard", handleOrderDashboard);
router.get("/transportDashboard", handleTransportDashboard);

module.exports = router;
