const User = require("./../models/User");
const {
  loginFormValidator,
  signupFormValidator,
  emailValidator,
  resetPasswordValidator,
  userNameValidator,
} = require("./../validation");
const { sendEmailMessage } = require("./../utils/sendMail");
const jwt = require("jsonwebtoken");
const { hashPassword, comparPasswords } = require("./../utils/hashPassword");
const catchAsync = require("./../utils/catchAsync");

exports.signupUser = catchAsync(async (req, res) => {
  //validate user data
  const { value, error } = signupFormValidator(req.body);
  //return error message if any
  if (error) {
    return res.json({ message: error.details[0].message });
  }
  //check if the user already exist
  const isAlreadyUser = await User.find({ email: value.email });
  if (isAlreadyUser.length !== 0)
    return res.json({ message: "this email is already registerd" });

  //encrypt user password
  const hashedPassword = hashPassword(value.password);

  //create new user object
  const newUser = new User({
    userName: value.userName,
    email: value.email,
    password: hashedPassword,
  });
  //save the user to database
  const savedUser = await newUser.save();
  const token = jwt.sign(
    { _id: savedUser._id },
    process.env.VERIFY_SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  //send account verifiction email
  sendEmailMessage({
    userEmail: savedUser.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: token,
    type: "accountVerification",
    userName: savedUser.userName,
    url: "verifyaccount",
  });
  return res.json({
    message: "user is saved successfully please verify your account",
  });
});

exports.loginUser = catchAsync(async (req, res) => {
  //validate user input
  const { value, error } = loginFormValidator(req.body);
  if (error) return res.json({ message: error.details[0].message });

  //login the user
  const isSignedEmail = await User.findOne(
    { email: value.email },
    { password: 1, isVerified: 1 }
  );
  if (isSignedEmail.length === 0)
    return res.json({ message: "this email isn't registerd please signup" });
  const hashedPassword = isSignedEmail.password;
  if (!comparPasswords(value.password, hashedPassword))
    return res.json({ message: "email or password isn't correct" });

  //check if the account is verified
  if (!isSignedEmail.isVerified)
    return res.json({
      message:
        "this Account is not verified please make sure to verify your account",
    });

  //login the user by sending his JWT token
  const token = jwt.sign({ _id: isSignedEmail._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  return res.json({ jwtToken: token });
});
//TODO:
exports.changeAccountEmail = catchAsync(async (req, res) => {
  const { _id } = req.user;
  //validate user data
  const { value, error } = emailValidator(req.body);
  if (error) return res.json({ message: error.details[0].message });

  //verify the new email
  const user = await User.findOne({ email: value.email });
  if (user) return req.json({ message: "this email is already used!!" });
  const userName = await User.findById(_id, { userName: 1 });
  const userToken = jwt.sign({ _id }, process.env.RESET_SECRET_KEY, {
    expiresIn: "1d",
  });
  sendEmailMessage({
    userEmail: value.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: userToken,
    type: "accountVerification",
    userName: userName,
    url: "verifyaccount",
  });
  req.json({
    message: "verification email was sent to your new account",
  });
});

//TODO:
exports.verifyNewEmail = catchAsync(async (req, res) => {
  const userToken = req.params.userToken;
  const { value, error } = emailValidator(req.body);
  if (error) return res.json({ message: error.details[0].message });

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

//TODO:
exports.changeUserName = catchAsync(async (req, res) => {
  const { _id } = req.user;
  //validate posted data
  const newUserName = req.body.userName;
  if (!newUserName) return req.json({ message: "new user name is required!" });
  const { value, error } = userNameValidator(req.body);
  if (error) return res.json({ message: error.details[0].message });
  //create update object
  await User.findOneAndUpdate({ _id }, { $set: { userName: value.userName } });
  return res.json({ status: "success" });
});

//TODO:
exports.forgetUserPassword = catchAsync(async (req, res) => {
  //validate user data
  const { value, error } = emailValidator(req.body.email);
  if (error) return res.json({ message: error.details[0].message });
  //check if this registerd email

  const user = await User.findOne(
    { email: value },
    { _id: 1, email: 1, userName: 1 }
  );
  const userToken = jwt.sign({ _id: user._id }, process.env.RESET_SECRET_KEY, {
    expiresIn: "1d",
  });
  if (!user) res.json({ message: "this email is not registerd" });

  //send reset password email
  sendEmailMessage({
    userEmail: user.email,
    subject: `Email Verification For ${process.env.APPLICATION_NAME}`,
    text: "Email verification",
    userID: userToken,
    type: "accountVerification",
    userName: user.userName,
    url: "resetpassword",
  });
  return res.json({
    message:
      "reset password email was sent to your email please check your inbox",
  });
});
//TODO:
exports.changePassword = catchAsync(async (req, res) => {});
//TODO:
exports.resetUserPassword = catchAsync(async (req, res) => {
  //validate user new password
  const jwtToken = req.params.userToken;
  const { value, error } = resetPasswordValidator(req.body);
  if (error) return res.json({ message: error.details[0].message });
  if (!jwtToken) return res.json({ message: "jwt in params missing!" });

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
    message: "password updated successfully please try to login",
  });
});
//TODO:
exports.verifyAccount = catchAsync(async (req, res) => {
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
