const express=require('express')
const orderRouter=express.Router()
const orderController=require('../controllers/orderController')
orderRouter.get('/testOrder',orderController.testOrder)
orderRouter.post('/addOrder',orderController.addOrder)
orderRouter.get('/getOrder',orderController.getOrder)
orderRouter.get('/getOrder/:id',orderController.getOrderById)
module.exports=orderRouter