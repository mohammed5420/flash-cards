const User = require("./../models/User");
const { loginFormValidator, signupFormValidator } = require("./../validation");
const { sendEmailMessage } = require("./../utils/emailVerification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signupUser = async (req, res) => {
  const { value, error } = signupFormValidator(req.body);
  if (error) {
    console.log(error);
    return res.json({ message: error.details[0].message });
  }
  if (value) {
    const isAlreadyUser = await User.find({ email: value.email });
    console.log(isAlreadyUser);
    if (isAlreadyUser.length !== 0)
      return res.json({ message: "this email is already registerd" });
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
};

exports.loginUser = async (req, res) => {
  const { value, error } = loginFormValidator(req.body);
  console.log(error);
  if (error) return res.json({ message: error.details[0].message });

  const isSignedEmail = await User.findOne(
    { email: value.email },
    { password: 1 }
  );
  if (isSignedEmail.length === 0)
    return res.json({ message: "this email isn't registerd please signup" });
  const hashedPassword = isSignedEmail.password;
  if (!bcrypt.compareSync(value.password, hashedPassword))
    return res.json({ message: "email or password isn't correct" });

  const token = jwt.sign({ _id: isSignedEmail._id }, process.env.SECRETKEY, {
    expiresIn: "30d",
  });
  res.json({ jwtToken: token });
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
  console.log(newUserName);
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
  //validate posted data
  const userEmail = req.body.email;
  if (!userEmail)
    return res.json({ message: "account email address is required" });
  //verify user email
  const user = await User.findOne({ email: userEmail }, { _id: 1, email: 1 });
  if (!user) res.json({ message: "this email " });

  //send reset password email
  sendEmailMessage({
    userEmail: userEmail,
    subject: "Try new things",
    text: "Node mailer",
    userID: user._id,
  });
  return res.json({
    message:
      "reset password email was sent to your email please check your inbox",
  });
};
//TODO:
exports.resetUserPassword = async (req, res) => {
  //validate posted data
  //get user id
  //update user password
};
//TODO: 
