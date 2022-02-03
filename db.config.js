const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(
    process.env.CONNECTION_STRING,
    (err) => {
      console.log(err);
    }
  );

module.exports = mongoose;