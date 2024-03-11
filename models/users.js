// const { sequelize } = require("../db.js");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true, // validates if the email is in the email format
      },
      set(value) {
        this.setDataValue("email", value.toLowerCase());
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error("Password must be at least 8 characters long");
          }
        },
        isYourPasswordpassword(value) {
          if (value.toLowerCase() === "password") {
            throw new Error(
              `Your password must not be the word ${value}, yk it is easy to crack ;p`
            );
          }
        },
      },
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      defaultValue: "male",
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: {
          args: [["Staff", "Manager"]],
          msg: "Please select role as Staff or Manager only",
        },
      },
    },
    department: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });
  return Users;
};
