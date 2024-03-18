const express=require('express')

const transportRouter=express.Router()
const transportController=require('../controllers/transportController')
transportRouter.get('/testTC',transportController.testTC)
transportRouter.post('/',transportController.addTransports)
transportRouter.get('/',transportController.getTranports)
transportRouter.get('/getTransportById/:id',transportController.getTransportById)
transportRouter.delete('/:id',transportController.deleteTransport)
transportRouter.patch('/:id',transportController.updateTransport)
transportRouter.get('/query',transportController.transportQuery)
module.exports=transportRouter
