const mongoose = require("mongoose");

//FlashCard color schema
const colorPaletteSchema = mongoose.Schema({
  frontSide: {
    type: String,
    required: true,
  },
  backSide: {
    type: String,
    required: true,
  },
});
//flashCard schema
const flashCardSchema = mongoose.Schema({
  authorID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "users",
  },
  frontSide: {
    type: String,
    required: true,
  },
  backSide: {
    type: String,
    required: true,
  },
  colorPalette: colorPaletteSchema,
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("card", flashCardSchema);
