const routes = require("express").Router();
const usersController = require("./../controllers/usersController");
/**
 * ### Auth Route
 * #### 1- Signup
 * #### 2- Login
 * #### 3- Logout
 * #### 4- Forget Password
 * #### 5- Reset Password
 */

/**
 * Signup user
 */
routes.post("/signup", usersController.signupUser);

/**
 * Login user
 */

routes.post("/login", usersController.loginUser);

module.exports = routes;
