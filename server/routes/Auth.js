/**
 * ### Auth Route
 * #### 1- Signup
 * #### 2- Login
 * #### 3- Logout
 * #### 4- Forget Password
 * #### 5- Reset Password
 */

const routes = require("express").Router();

/**
 * 3- Signup user
 */
routes.post("/signup", (req,res) => {

});

/**
 * Login user
 */

routes.post("/login", (req,res) => {

});

/**
 * Logout user
 */

routes.get("/logout", (req,res) => {

});

/**
 * forget-password 
 */

routes.post("/forget-password", (req,res) => {

});

/**
 * Reset user password
 */

routes.post("/reset-password", (req,res) => {

});

module.exports = routes;