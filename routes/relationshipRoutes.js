const express=require('express')
const relationRouter=express.Router()
const relationshipController=require('../controllers/relationshipController')
relationRouter.get('/userOrder/:id',relationshipController.userOrder)
relationRouter.get('/transportOrder',relationshipController.transportOrder)
module.exports=relationRouter