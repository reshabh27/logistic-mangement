const express = require("express");
const orderTransportRouter = express.Router();
const orderTransportController = require("../controllers/orderTransportController");

orderTransportRouter.post(
  "/orders/:orderId/transport",
  orderTransportController.addOrderTransport
);
orderTransportRouter.patch(
  "/orders/:orderId/transport/:orderTransportId",
  orderTransportController.updateOrderTransport
);

module.exports = orderTransportRouter;
