const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.CONNECTION_STRING,() => {
    console.log("connected to mongoooo!");
});

module.exports = mongoose;