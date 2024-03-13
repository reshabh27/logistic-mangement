const jwt = require("jsonwebtoken");
const { users } = require("../db");
const { Op } = require("sequelize");


exports.auth = async (req, res, next) => {
    try {

        const token = await req.header('Authorization')?.replace('Bearer ', '')
        // console.log("token", token);
        if (!token)
            return res.status(400).send({ message: "Please Authenticate first." })
        const decoded = jwt.verify(token, "my_secret")
        const curUser = await users.findOne({
            where: {
                id: decoded.id,
                tokens: {
                    [Op.like]: `%${token}%`
                }
            }
        })
        // console.log("decoded", decoded);
        // console.log("user", curUser);
        if (!curUser) {
            return res.status(400).send({ message: "Please authenticate first." })
            // throw new Error()
        }

        req.token = token
        req.curUser = curUser
        req.role = decoded.role
        // console.log(user);
        next();
    } catch (error) {
        console.log(error);
    }
}