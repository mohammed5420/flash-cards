const User = require("./../models/User");
const { loginFormValidator, signupFormValidator } = require("./../validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

export const signupUser = async (req, res) => {
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

export const loginUser = async (req, res) => {
  const { value, error } = loginFormValidator(req.body);
  console.log(error);
  if (error) return res.json({ message: error.details[0].message });

  const isSignedEmail = await User.find(
    { email: value.email },
    { password: 1 }
  );
  if (isSignedEmail.length === 0)
    return res.json({ message: "this email isn't registerd please signup" });
  const hashedPassword = isSignedEmail[0].password;
  if (!bcrypt.compareSync(value.password, hashedPassword))
    return res.json({ message: "email or password isn't correct" });

  const token = jwt.sign({ _id: isSignedEmail[0]._id }, process.env.SECRETKEY, {
    expiresIn: "30d",
  });
  res.json({ jwtToken: token });
};
//TODO:
export const updateUserAccountInfo = async (req, res) => {};
//TODO:
export const forgetUserPassword = async (req, res) => {};
//TODO:
export const resetUserPassword = async (req, res) => {};
