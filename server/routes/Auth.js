const routes = require("express").Router();
const User = require("./../models/User");
const { singupFormValidatior } = require("./../validation");
const bcrypt = require("bcryptjs");
/**
 * ### Auth Route
 * #### TODO: 1- Signup
 * #### 2- Login
 * #### 3- Logout
 * #### 4- Forget Password
 * #### 5- Reset Password
 */

/**
 * Signup user
 */
routes.post("/signup", async (req, res) => {
  const { value, error } = singupFormValidatior(req.body);
  if (error) {
    return res.json({ message: error.details[0].message });
  }
  if (value) {
    const isAllreadyUser = await User.find({ email: value.email });
    console.log(isAllreadyUser);
    if (isAllreadyUser.length !== 0)
      return res.json({ message: "this email is allready registred" });
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(value.password, salt);
    const newUser = new User({
      userName: value.userName,
      email: value.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await newUser.save();
      return res.json(savedUser);
    } catch (err) {
      return res.json({ message: err.message });
    }
  }
});

/**
 * Login user
 */

routes.post("/login", (req, res) => {});

/**
 * Logout user
 */

routes.get("/logout", (req, res) => {});

/**
 * forget-password
 */

routes.post("/forget-password", (req, res) => {});

/**
 * Reset user password
 */

routes.post("/reset-password", (req, res) => {});

module.exports = routes;
