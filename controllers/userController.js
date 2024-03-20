const { Op } = require("sequelize");
const { users } = require("../db");
const asyncErrorHandler = require("../utils/asyncErrorHandler");


// Controller for Signup
exports.handleSignup = asyncErrorHandler(async (req, res) => {
    // Create a new user with the provided data
    const newUser = await users.create(req.body);

    return res.status(201).json({ "message": "User registered successfully", newUser });
})

// Controller for Login
exports.handleLogin = asyncErrorHandler(async (req, res) => {
    // Find the user by provided credentials and generate a token
    const curUser = await users.findByCredentials(req.body.username, req.body.password);
    if (!curUser)
        res.status(404).send({ message: "User not found" });
    const token = await curUser.generateToken();

    res.status(200).send({ "message": "Login successful", token });
})


// Controller for getting all users based on query parameters
// ?role=Customer
// ?username=john
// ?sortBy=username_ASC
exports.getAllUsers = asyncErrorHandler(async (req, res) => {
    // Set options based on query parameters
    let options = {};
    if (req.query?.role)
        options.role = req.query.role;

    let usernameOption = "";
    if (req.query?.username)
        usernameOption = req.query.username;
    console.log(usernameOption);
    let sortByfield = [];
    const canSortFields = ["username", "role", "email", "contactName", "phone"];
    if (req.query?.sortBy) {
        sortByfield = req.query.sortBy.split("_");
        if (!canSortFields.includes(sortByfield[0]))
            return res.status(400).send({ message: "Can not sort based on given method." });
    }

    // Check if the user is an admin
    if ((req.role !== "Admin") && (req.role !== "Super Admin"))
        return res.status(403).send({ message: "You are not allowed to do this operation." });

    // Find all users based on role, username and order
    const allUsers = await users.findAll({
        where: {
            ...options,
            username: {
                [Op.like]: `%${usernameOption}%`
            }
        },
        order: sortByfield.length > 0 ? [[sortByfield[0], sortByfield[1]]] : []
    });

    res.status(200).send({ allUsers });
})



// Controller for getting the current user profile
exports.handleGetMe = asyncErrorHandler(async (req, res) => {
    return res.send({ user: req.curUser });
})


// Controller for updating user profile
exports.handleUpdateProfile = asyncErrorHandler(async (req, res) => {
    // fields that are allowed to be updated
    const fields = ["email", "ContactName", "phone"];

    // Check if any field in req.body is not allowed
    const isNotUpdatable = Object.keys(req.body).some(key => !fields.includes(key));

    if (isNotUpdatable)
        res.status(403).send({ message: "Only email, ContactName, phone can be edited" });

    // Update user profile with the provided data
    for (const key in req.body) {
        if (Object.prototype.hasOwnProperty.call(req.body, key)) {
            req.curUser[key] = req.body[key];
        }
    }

    await req.curUser.save();
    return res.status(200).send({ "message": "Profile updated successfully", user: req.user })
})


// Controller for user logout
exports.handleLogout = asyncErrorHandler(async (req, res) => {
    const curruser = req.curUser;
    const currentTokens = JSON.parse(curruser.tokens);

    const isAvailable = currentTokens.some(ele => ele.token === req.token);

    if (!isAvailable)
        return res.status(400).send({ message: "you are already logged out" })
    const filteredTokens = currentTokens.filter((token) => {
        return token.token !== req.token;
    })

    curruser.tokens = JSON.stringify(filteredTokens);
    await curruser.save();
    res.json("Logout successful");

})


// Controller for updating user role
exports.handleUpdateUserRole = asyncErrorHandler(async (req, res) => {
    if ((req.role !== "Admin") && (req.role !== "Super Admin"))
        res.status(401).send({ message: "only Admin can access this." })

    const userId = req.params.userId

    await users.update(req.body, {
        where: {
            id: userId
        }
    })

    const curUser = await users.findByPk(userId)
    return res.status(201).send({ "message": "User role updated successfully", curUser });
})


// Controller for deleting user profile
exports.handleDeleteProfile = asyncErrorHandler(async (req, res) => {
    if ((req.role !== "Admin") && (req.role !== "Super Admin"))
        res.status(403).send({ messgae: "You are not allowed to do this operation" })

    const userId = req.params.userId;

    await users.destroy({
        where: {
            id: userId
        }
    });

    res.status(200).send({ message: "User deleted successfully" });
})