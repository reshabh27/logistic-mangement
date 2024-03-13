const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error("Password should be at least 8 characters long !!");
          }
        },
        isNotPassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error('Password cannot be "password !!"');
          }
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      validate: {
        isIn: {
          args: [["Admin", "Supplier", "Customer", "Warehouse Manager", "Transport Manager"]],
          msg: "Please select role from Admin, Supplier, Customer, Warehouse Manager, Transport Manager",
        },
      },
    },
    ContactName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: { args: /^\+(?:[0-9]●?){6,14}[0-9]$/, msg: "Invalid phone number format." },
      },
    },
    tokens: {
      type: DataTypes.TEXT,
      defaultValue: "[]",
      allowNull: false
    }
  });

  // Hooks (beforeCreate) to perform actions before creating a user
  User.beforeCreate(async (user, options) => {
    user.username = user.username.trim();
    user.email = user.email.trim();
    user.password = user.password.trim();
    user.password = await bcrypt.hash(user.password, 8);
    user.tokens = JSON.stringify([]);
  })


  // Hooks (beforeUpdate) to perform actions before updating a user
  User.beforeUpdate(async (user, option) => {
    if (user.changed("password")) {
      user.password = user.password.trim();
      user.password = await bcrypt.hash(password, 8);
    }
  })


  // Custom method to generate a token for the user
  User.prototype.generateToken = async function () {
    let user = this;

    // generating token using jsonwebtoken
    const token = jwt.sign({ id: user.id.toString(), role: user.role }, "my_secret");
    let tokens = JSON.parse(user.tokens || "[]");
    tokens.push({ token });
    user.tokens = JSON.stringify(tokens);
    await user.save();
    return token;
  }


  // Custom method to find a user by provided credentials
  User.findByCredentials = async (username, password) => {

    const user = await User.findOne({ where: { username: username } })

    // if user not found with the username
    if (!user) {
      throw new Error("there are no user with this username!")
    }

    // checking if password matches
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      throw new Error("Unable to login !!")
    }
    return user
  }


  return User;
};
