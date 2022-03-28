const bcrypt = require("bcryptjs");

//Encrypt password 
exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

//Compare hashed password
exports.comparPasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
