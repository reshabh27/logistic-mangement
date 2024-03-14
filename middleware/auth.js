const jwt = require("jsonwebtoken");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const { User } = require("../db");

exports.auth = async (req, res, next) => {
  try {
    const token = await req.header("Authorization").replace("Bearer ", "");
    // console.log("token", token);
    const decoded = jwt.verify(token, "my_secret");
    const user = await User.findOne({ id: decoded.id, "tokens.token": token });
    // console.log("decoded", decoded);
    // console.log("user", user);
    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    req.role = decoded.role;
    // console.log(user);
    next();
  } catch (error) {
    console.log(error);
  }
};
