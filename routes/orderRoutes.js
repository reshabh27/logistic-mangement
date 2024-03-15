const express = require('express')
const orderRouter = express.Router()
const orderController = require('../controllers/orderController')
const { auth } = require('../middleware/auth')
orderRouter.get('/testOrder',auth, orderController.testOrder)
orderRouter.post('/addOrder',auth ,orderController.addOrder)
orderRouter.get('/getOrder',auth , orderController.getOrder)
orderRouter.get('/getOrder/:id',auth , orderController.getOrderById)
orderRouter.delete('/deleteOrder/:id', auth ,orderController.deleteOrder)
orderRouter.patch('/updateOrder/:id',auth ,  orderController.updateOrder)
orderRouter.get('/manyToOne',auth ,  orderController.manyToOne)
orderRouter.post("/addDetails",orderController.addOrderDetails);
module.exports = orderRouter
