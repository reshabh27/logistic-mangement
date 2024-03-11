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

exports.handleGetMe = asyncErrorHandler(async (req, res) => {
    return res.send({ user: req.user });
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