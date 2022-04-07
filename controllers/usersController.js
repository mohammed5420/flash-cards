/** App Controller providing related user functions
 * @module controllers/usersController
 * @requires express
 */

const User = require("./../models/User");
const Card = require("./../models/FlashCard");
const Game = require("./../models/Game");
const {
  loginFormValidator,
  signupFormValidator,
  emailValidator,
  resetPasswordValidator,
  newPasswordValidator,
  userNameValidator,
} = require("./../validation");
const { sendEmailMessage } = require("./../utils/sendMail");
const jwt = require("jsonwebtoken");
const { hashPassword, comparPasswords } = require("./../utils/hashPassword");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/errorsHandler");

const userBrowser = require("./../utils/browserDetector.js");

/**
 * Route to signup new users.
 * @name post/signupUser
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const signupUser = catchAsync(async (req, res, next) => {
  //validate user data
  const { value, error } = signupFormValidator(req.body);
  //return error message if any
  if (error) {
    return next(new AppError(error.details[0].message, 406));
  }
  //check if the user already exist
  const isAlreadyUser = await User.find({ email: value.email });
  if (isAlreadyUser.length !== 0)
    return next(new AppError("This account is already registerd", 403));

  //encrypt user password
  const hashedPassword = hashPassword(value.password);
  //create new user object
  const newUser = new User({
    userName: value.userName,
    email: value.email,
    password: hashedPassword,
  });
  //save the user to database
  newUser.setUserAvatar();
  const savedUser = await newUser.save();
  const token = jwt.sign(
    { _id: savedUser._id },
    process.env.VERIFY_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
  const userInfo = userBrowser(req);

  //send account verifiction email
  sendEmailMessage({
    userEmail: savedUser.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: token,
    type: "accountVerification",
    userName: savedUser.userName,
    url: "verifyaccount",
    os: userInfo.os.name,
    browser: userInfo.browser.name,
  });
  return res.json({
    status: "success",
    message: "user is saved successfully please verify your account",
  });
});

/**
 * Route to login users.
 * @name post/loginUser
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const loginUser = catchAsync(async (req, res, next) => {
  //validate user input
  const { value, error } = loginFormValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));

  //login the user
  const user = await User.findOne(
    { email: value.email },
    { password: 1, isVerified: 1, userName: 1, email: 1, avatar: 1 }
  );
  if (!user)
    return res.json({ message: "this email isn't registerd please signup" });
  const hashedPassword = user.password;
  if (!comparPasswords(value.password, hashedPassword))
    return next(new AppError("email or password is incorrect", 403));

  //check if the account is verified
  if (!user.isVerified)
    return next(new AppError("This account is not verified!", 403));

  //login the user by sending his JWT token
  const token = jwt.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    process.env.SECRET_KEY,
    {
      expiresIn: "10d",
    }
  );
  const userObject = {
    useName: user.userName,
    userId: user._id,
    email: user.email,
    avatar: user.avatar,
  };
  return res.json({ status: "success", user: userObject, jwtToken: token });
});

/**
 * Route to change user email account.
 * @name post/changeAccountEmail
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const changeAccountEmail = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  //validate user data
  const { value, error } = emailValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));

  //verify the new email
  const user = await User.findOne({ email: value.email });
  if (user) return next(new AppError("This email is already registerd", 204));
  const userName = await User.findById(_id, { userName: 1 });
  const userToken = jwt.sign({ _id }, process.env.RESET_SECRET_KEY, {
    expiresIn: "1d",
  });

  const userInfo = userBrowser(req);
  sendEmailMessage({
    userEmail: value.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: userToken,
    type: "accountVerification",
    userName: userName,
    url: "verifyaccount",
    os: userInfo.os.name,
    browser: userInfo.browser.name,
  });
  req.json({
    status: "success",
    message: "verification email was sent to your new account",
  });
});

/**
 * Route to verify new user email.
 * @name post/verifyNewAccountEmail
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const verifyNewAccountEmail = catchAsync(async (req, res, next) => {
  const userToken = req.params.userToken;
  const { value, error } = emailValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));

  if (!userToken)
    return res.json({
      message: "make sure your signup credentials are correct",
    });

  const { _id } = jwt.verify(userToken, process.env.VERIFY_SECRET_KEY);
  await User.findByIdAndUpdate(_id, {
    $set: {
      email: value.email,
    },
  });
  res.redirect("/users/login");
});

/**
 * Route to change user name.
 * @name post/changeUserName
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const changeUserName = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  //validate posted data
  const newUserName = req.body.userName;
  if (!newUserName) return req.json({ message: "new user name is required!" });
  const { value, error } = userNameValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));
  //create update object
  await User.findOneAndUpdate({ _id }, { $set: { userName: value.userName } });
  return res.json({
    status: "success",
    message: "username successfully changed",
  });
});

/**
 * Route to send password reset email.
 * @name post/forgetUserPassword
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const forgetUserPassword = catchAsync(async (req, res, next) => {
  //validate user data
  const { value, error } = emailValidator(req.body.email);
  if (error) return next(new AppError(error.details[0].message, 406));
  //check if this registerd email

  const user = await User.findOne(
    { email: value },
    { _id: 1, email: 1, userName: 1 }
  );
  const userToken = jwt.sign({ _id: user._id }, process.env.RESET_SECRET_KEY, {
    expiresIn: "1d",
  });
  if (!user) return next(new AppError("This email is not registerd", 403));

  //send reset password email
  sendEmailMessage({
    userEmail: user.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: userToken,
    type: "resetEmail",
    userName: user.userName,
    url: "resetpassword",
  });
  return res.json({
    message:
      "reset password email was sent to your email please check your inbox",
  });
});

/**
 * Route to change user password.
 * @name post/changeUserPassword
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const changeUserPassword = catchAsync(async (req, res, next) => {
  //get user id
  const { _id } = req.user;
  //validate user data
  const { value, error } = newPasswordValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));
  //verify old password
  const userCurrentPassword = await User.findOne({ _id }, { password: 1 });
  if (!comparPasswords(value.old_password, userCurrentPassword))
    return next(new AppError(`The old password is wrong`, 406));
  //encrypt the new password
  const newHashedPassword = hashPassword(value.old_password);
  //update user password
  await User.updateOne(
    { _id },
    {
      $set: {
        password: newHashedPassword,
      },
    }
  );
});

/**
 * Route to upload new profile picture.
 * @name post/updateProfileImage
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const updateProfileImage = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  if (req.file == null) {
    return res.status(400).json({
      status: "invalid",
      message: "please make sure to upload your profile image",
    });
  }
  console.log(req.file.filename);

  const user = await User.updateOne({ _id }, { avatar: req.file.filename });
  res.status(200).json({
    status: "success",
    message: "profile picture updated successfully",
  });
});

/**
 * Route to reset user password after receiving password reset email .
 * @name post/resetUserPassword
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const resetUserPassword = catchAsync(async (req, res, next) => {
  //validate user new password
  const jwtToken = req.params.userToken;
  const { value, error } = resetPasswordValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));
  if (!jwtToken) return next(new AppError("JWT is missing", 204));

  //verify jwt token
  const { _id } = jwt.verify(jwtToken, process.env.RESET_SECRET_KEY);

  //crypt user password
  const hashedPassword = hashPassword(value.new_password);

  //find the user and update user password
  await User.updateOne(
    { _id },
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: Date.now(),
      },
    }
  );

  return res.json({
    status: "success",
    message: "password updated successfully please try to login",
  });
});

/**
 * Route to verify new registerd accounts.
 * @name post/verifyAccount
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
const verifyAccount = catchAsync(async (req, res) => {
  const userToken = req.params.userToken;
  if (!userToken)
    return res.json({
      message: "make sure your signup credentials are correct",
    });

  const { _id } = jwt.verify(userToken, process.env.VERIFY_SECRET_KEY);
  await User.findByIdAndUpdate(_id, {
    $set: {
      isVerified: true,
    },
  });
  return res.redirect("/users/login");
});

/**
 * Route to delete user account.
 * @name post/deleteUserAccount
 * @function
 * @memberof module:controllers/usersController
 * @inner
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

const deleteUserAccount = catchAsync(async (req, res, next) => {
  //Get user ID
  const { _id } = req.user;
  //find and delete user
  const user = await User.findByIdAndDelete(_id);
  if (!user) {
    return new AppError("There is no user with this ID", 403);
  }
  //find and delete all user flashCards and game history
  await Card.deleteMany({ authorID: user._id });
  await Game.deleteOne({ playerId: user._id });
  //redirect to signup page
  return res.send({
    status: "success",
    message: "account deleted successfully!",
  });
});

module.exports = {
  signupUser,
  loginUser,
  forgetUserPassword,
  changeUserName,
  changeAccountEmail,
  deleteUserAccount,
  verifyAccount,
  verifyNewAccountEmail,
  resetUserPassword,
  changeUserPassword,
  updateProfileImage,
};
