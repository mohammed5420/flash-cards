const mongoose = require("mongoose");

const flashCardSchema = mongoose.Schema({
    authorID: {
        type: mongoose.SchemaTypes.ObjectId,     
        required: true,
        ref: "users"
    },
    frontSide: {
        type: String,
        required: true,
    },
    backSide: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    }
});

module.exports = mongoose.model("card",flashCardSchema);