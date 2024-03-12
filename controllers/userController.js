const { User } = require("../db");
const asyncErrorHandler = require("../utils/asyncErrorHandler");



exports.handleSignup = asyncErrorHandler(async (req, res) => {
    // console.log(req.body);
    const user = await User.create(req.body);
    // console.log(user);

    return res.status(201).json({ "message": "User registered successfully", user });
})

exports.handleLogin = asyncErrorHandler(async (req, res) => {
    const user = await User.findByCredentials(req.body.username, req.body.password);
    if (!user)
        res.status(404).send({ message: "User not found" });
    const token = await user.generateToken();

    res.status(200).send({ "message": "Login successful", token });
})


exports.getAllUsers = asyncErrorHandler(async (req, res) => {
    if (req.role !== "Admin")
        res.send(403).send({ message: "You are not allowed to do this operation." });
    const users = await User.findAll({});
    // console.log(users);
    res.status(200).send({ users });
})


exports.handleGetMe = asyncErrorHandler(async (req, res) => {
    return res.send({ user: req.user });
})


exports.handleUpdateProfile = asyncErrorHandler(async (req, res) => {
    const fields = ["email", "ContactName", "phone"];
    const isNotUpdatable = Object.keys(req.body).some(key => !fields.includes(key));
    // console.log(isNotUpdatable);
    if (isNotUpdatable)
        res.status(403).send({ message: "Only email, ContactName, phone can be edited" });

    for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            req.user[key] = req.body[key];
        }
    }

    await req.user.save();

    return res.status(200).send({ "message": "Profile updated successfully", user: req.user })
})

exports.handleLogout = asyncErrorHandler(async (req, res) => {
    const curruser = req.user;
    const currentTokens = JSON.parse(curruser.tokens);
    // console.log("currenttoken", currentTokens);
    const isAvailable = currentTokens.some(ele => ele.token === req.token);
    // console.log("isavailable", isAvailable);
    if (!isAvailable)
        return res.status(400).send({ message: "you are already logged out" })
    const filteredTokens = currentTokens.filter((token) => {
        return token.token !== req.token;
    })
    curruser.tokens = JSON.stringify(filteredTokens);
    // console.log("filteredtoken", filteredTokens);
    await curruser.save();
    res.json("Logout successful");

})

exports.handleUpdateUserRole = asyncErrorHandler(async (req, res) => {
    if (req.role !== "Admin")
        res.status(401).send({ message: "only Admin can access this." })
    const userId = req.params.userId
    // console.log(req.body);
    const test = await User.update(req.body, {
        where: {
            id: userId
        }
    })
    const user = await User.findByPk(userId)
    // console.log(test);
    return res.status(201).send({ "message": "User role updated successfully", user });
})


exports.handleDeleteProfile = asyncErrorHandler(async (req, res) => {
    if (req.role !== "Admin")
        res.status(403).send({ messgae: "You are not allowed to do this operation" })
    const userId = req.params.userId;
    await User.destroy({
        where: {
            id: userId
        }
    });
    res.status(200).send({ message: "User deleted successfully" });

})