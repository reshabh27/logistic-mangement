const db = require("../db/index");
const { Sequelize } = require("sequelize");
const Order = db.orders;
const User = db.users;
const Transport=db.transports

const userOrder = async (req, res) => {
  try {
    const data = await User.findAll({
      include: [
        {
          model: Order,
        },
      ],
      where: {
        id: req.params.id,
      },
    });
    if(!data){
        return res.status(404).json({
            message:'User with this id is not available'
        })
    }
    return res.status(200).json({ data });
  } catch (err) {
    // console.log(err)
    return res.status(400).json({
      message: err.message,
    });
  }
};
const transportOrder=async(req,res)=>{
 try{
     const data=await Transport.findAll({
        include:[{
            model:Order
        }]
     })
     return res.status(200).json({data})
 }catch(err){

 }
}
module.exports = { userOrder,transportOrder };
