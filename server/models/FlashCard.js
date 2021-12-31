const mongoose = require("mongoose");

const flashCardSchema = mongoose.Schema({
    author: {
        type: String,     
        required: true
    },
    frontside: {
        type: String,
        required: true,
    },
    backside: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

module.exports = mongoose.model("card",flashCardSchema);