const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
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