/**
 * Express router to mount all app routes.
 * @type {object}
 * @const
 */

const routes = require("express").Router();
const usersController = require("./../controllers/usersController");
const verifyToken = require("./../middleware/verifyToken");
const { upload } = require("../middleware/multer");
const { imageResizer } = require("../middleware/imageResizer");

/**
 * ### Auth Route
 * #### 1- Signup
 * #### 2- Login
 * #### 3- Logout
 * #### 4- Forget Password
 * #### 5- Reset Password
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - userName
 *         - email
 *         - password
 *         - confirmPassword
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         userName:
 *           type: string
 *           description: the user name
 *         joinedAt:
 *            type: date
 *            description: The date when the user signed
 *         password:
 *            type: string
 *            description: user hashed password
 *         isAdmin:
 *            type: boolean
 *            description: Is the user an admin or not
 *         isVerified:
 *            type: boolean
 *            description: is the user verified or not
 *         avatar:
 *            type: string
 *            description: URL for user avatar
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: User name
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *               confirmPassword:
 *                 type: string
 *                 description: confirm user password
 *     responses:
 *       200:
 *         description: The user is saved successfully please verify your account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */

routes.post("/signup", usersController.signupUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login users
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 user:
 *                   type: object
 *                   properties:
 *                     userName:
 *                       type: string
 *                       description: the user name
 *                     userId:
 *                       type: string
 *                       description: the user id
 *                     email:
 *                       type: string
 *                       description: the user email
 *                     avatar:
 *                       type: string
 *                       description: user's avatar url
 *                 jwtToken:
 *                   type: string
 *                   description: jwt token to access protected routes
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */

routes.post("/login", usersController.loginUser);

/**
 * @swagger
 * /username:
 *   post:
 *     summary: Change user name
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                userName:
 *                  type: string
 *                  description: the new user name
 *     responses:
 *       200:
 *         description: logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */

routes.post("/username", verifyToken, usersController.changeUserName);

/**
 * @swagger
 * /forgetPassword:
 *   post:
 *     summary: Send reset password email
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                email:
 *                  type: string
 *                  description: user account email
 *     responses:
 *       200:
 *         description: reset account password email sent to your email check you inbox
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */
 

routes.post("/forgetPassword", usersController.forgetUserPassword);

/**
 * @swagger
 * /updateprofile:
 *   patch:
 *     summary: Update user profile image
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *        - in: formData
 *          name: profileImage
 *          type: file
 *          description: The file to upload.
 *     tags: [User]
 *     responses:
 *       200:
 *         description: profile picture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */


routes.patch(
  "/updateprofile",
  verifyToken,
  upload.single("profileImage"),
  imageResizer,
  usersController.updateProfileImage
);

/**
 * @swagger
 * /delete:
 *   get:
 *     summary: Delete user account
 *     tags: [User]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: account deleted successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */

routes.get("/delete", verifyToken, usersController.deleteUserAccount);

/**
 * @swagger
 * /verifyaccount/{userToken}:
 *   get:
 *     summary: Verify user account
 *     parameters:
 *       - in: path
 *         name: userToken
 *         schema:
 *           type: string
 *         required: true
 *         description: jwt to verify user account
 *     tags: [User]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: account verified successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */


routes.get("/verifyaccount/:userToken", usersController.verifyAccount);

/**
 * @swagger
 * /resetpassword/{userToken}:
 *   post:
 *     summary: Route reset account password
 *     parameters:
 *       - in: path
 *         name:  userToken
 *         schema:
 *         type: string
 *         required: true
 *         description: jwt to verify user account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                newPassword:
 *                  type: string
 *                  description: the new user password
 *                confirmPassword:
 *                  type: string
 *                  description: confirm user new password
 *     responses:
 *       200:
 *         description: password updated successfully!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string 
 *       500:
 *         description: Some server error
 */

routes.post("/resetpassword/:userToken", usersController.resetUserPassword);
module.exports = routes;
