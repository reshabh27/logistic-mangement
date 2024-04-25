const express = require('express')
const orderRouter = express.Router()
const orderController = require('../controllers/orderController')
const { auth } = require('../middleware/auth')
orderRouter.get('/testOrder', orderController.testOrder)
orderRouter.post('/',auth,orderController.addOrder)
orderRouter.get('/',auth, orderController.getOrder)
orderRouter.get('/getOrderById:id',auth , orderController.getOrderById)
orderRouter.delete('/:id', auth ,orderController.deleteOrder)
orderRouter.patch('/:id' ,auth,  orderController.updateOrder)
orderRouter.get('/query' ,  orderController.searchAndSort)
orderRouter.get('/manyToOne',auth ,  orderController.manyToOne)
orderRouter.post("/addDetails",orderController.addOrderDetails);
module.exports = orderRouter
