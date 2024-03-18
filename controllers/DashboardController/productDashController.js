const db = require("../../db");
const Product = db.products;
const Order = db.orders;
const OrderDetails = db.orderDetails;

//Display the total number of products managed by the supplier.
const totalProducts = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  try {
    const { count } = await Product.findAndCountAll({ transaction: t });
    if (!count) {
      return res
        .status(200)
        .json({ message: "No record founds in Product Table" });
    }
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({ "Total Products": count });
  } catch (error) {
    await t.rollback();
    console.log("RollBack Initiated");
    return res.status(400).json(error);
  }
};

//Show a breakdown of products by category.

const groupByCategory = async (req, res) => {
  const t = await db.sequelize.transaction();
  console.log("Transaction Initiated");
  try {
    const products = await Product.findAll(
      {
        attributes: [
          "category",
          [db.sequelize.fn("COUNT", db.sequelize.col("*")), "productCount"],
        ],
        group: ["category"],
      },
      { transaction: t }
    );
    await t.commit();
    console.log("Transaction Commited");
    return res.status(200).json({ "Products By Category": products });
  } catch (error) {
    await t.rollback();
    console.log("RollBack Initiated");
    return res.status(400).json(error);
  }
};


//List the most recently added products.
const recentAddition = async(req,res)=>{
    const t = await db.sequelize.transaction();
    console.log("Transaction Initiated");

    try {
        const products = await Product.findAll({
            order:[["createdAt","DESC"]],
        })
        await t.commit();
        console.log("Transaction Commited");
        return res.status(200).json({ "Recent Additions": products });
    } catch (error) {
        await t.rollback();
        console.log("RollBack Initiated");
        return res.status(400).json(error);
    }
}

//Display the top-selling products based on order data.
const topSeller = async(req,res) => {
    const t = await db.sequelize.transaction();
    console.log("Transaction Initiated");
    try {
        const data = await OrderDetails.findAll({
            attributes:[
                [db.sequelize.fn('SUM', db.sequelize.col('quantity')), 'totalQuantity']
            ],
            include:[
                {model:Product}
            ],
            group:['productId'],
            order: [[db.sequelize.literal('totalQuantity'), 'DESC']],
        },{transaction:t});
        await t.commit();
        console.log("Transaction Commited");
        return res.status(200).json({ data });
    } catch (error) {
        await t.rollback();
        console.log("RollBack Initiated");
        return res.status(400).json(error);
    }
}


module.exports = { totalProducts, groupByCategory, recentAddition,topSeller };
