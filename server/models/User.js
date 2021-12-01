const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    joinedAt: {
        type: Date,
        default: () => Date.now()
    }
});

module.exports = mongoose.model("users",userSchema);