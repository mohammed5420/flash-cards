const routes = require("express").Router();
const usersController = require("./../controllers/usersController");
const verifyToken = require("./../middleware/verifyToken");
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

/**
 * Change user email
 */
routes.post("/username", verifyToken, usersController.changeUserName);

routes.post("/forgetPassword", usersController.forgetUserPassword);

routes.get("/verifyaccount/:userToken", usersController.verifyAccount);

module.exports = routes;
