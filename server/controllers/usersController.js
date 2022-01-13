const User = require("./../models/User");
const { loginFormValidator, signupFormValidator } = require("./../validation");
const { sendEmailMessage } = require("./../utils/sendMail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signupUser = async (req, res) => {
  //validate user data
  const { value, error } = signupFormValidator(req.body);
  //return error message if any
  if (error) {
    console.log(error);
    return res.json({ message: error.details[0].message });
  }
  //check if the user already exist
  const isAlreadyUser = await User.find({ email: value.email });
  console.log(isAlreadyUser);
  if (isAlreadyUser.length !== 0)
    return res.json({ message: "this email is already registerd" });

  //encrypt user password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(value.password, salt);

  //create new user object
  const newUser = new User({
    userName: value.userName,
    email: value.email,
    password: hashedPassword,
  });

  try {
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
  } catch (err) {
    return res.json({ message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  //validate user input
  const { value, error } = loginFormValidator(req.body);
  console.log(error);
  if (error) return res.json({ message: error.details[0].message });

  //login the user
  const isSignedEmail = await User.findOne(
    { email: value.email },
    { password: 1, isVerified: 1 }
  );
  if (isSignedEmail.length === 0)
    return res.json({ message: "this email isn't registerd please signup" });
  const hashedPassword = isSignedEmail.password;
  if (!bcrypt.compareSync(value.password, hashedPassword))
    return res.json({ message: "email or password isn't correct" });

  //check if the account is verified
  console.log("user => ", isSignedEmail);
  console.log("verified => ", isSignedEmail.isVerified);
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
};
//TODO:
exports.changeAccountEmail = async (req, res) => {
  //validate posted data
};
//TODO:
exports.changeUserName = async (req, res) => {
  const { _id } = req.user;
  //validate posted data
  const newUserName = req.body.userName;
  if (!newUserName) return req.json({ message: "user name is required!" });
  //create update object
  try {
    await User.findOneAndUpdate({ _id }, { $set: { userName: newUserName } });
    return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "something went wrong" });
  }
};

//TODO:
exports.forgetUserPassword = async (req, res) => {
  //validate user data
  try {
    const userEmail = req.body.email;
    if (!userEmail)
      return res.json({ message: "account email address is required" });
    //verify user email
    const user = await User.findOne({ email: userEmail }, { _id: 1, email: 1 });
    const userToken = jwt.sign(
      { _id: user._id },
      process.env.VERIFY_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );
    if (!user) res.json({ message: "this email is not registerd" });

    //send reset password email
    sendEmailMessage({
      userEmail: userEmail,
      subject: "Try new things",
      text: "Node mailer",
      userID: userToken,
    });
    return res.json({
      message:
        "reset password email was sent to your email please check your inbox",
    });
  } catch (err) {
    console.error("ERROR ⚡", err);
  }
};
//TODO:
exports.resetUserPassword = async (req, res) => {
  // const jwtToken = req.params.jwt;
  // //Get the
  // if (!jwtToken)
  //   res.json({ message: "please make sure to send registerd email" });
  // try {
  //   const token = jwt.verify(jwtToken, process.env.SECRET_KEY);
  //   const userID = token._id;
  //   const user = await User.updateOne({ _id: userID },{$set: {
  //     password
  //   }});
  // } catch (error) {
  //   console.error(error);
  // }
};
//TODO:
exports.verifyAccount = async (req, res) => {
  const userToken = req.params.userToken;
  if (!userToken)
    return res.json({
      message: "make sure your signup credentials are correct",
    });

  try {
    const { _id } = jwt.verify(userToken, process.env.VERIFY_SECRET_KEY);
    await User.findByIdAndUpdate(_id, {
      $set: {
        isVerified: true,
      },
    });
    return res.redirect("/users/login");
  } catch (err) {
    console.error("ERROR ⚡", err);
  }
};
