const bcrypt = require("bcryptjs");
exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

exports.comparPasswords = (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword);
};
