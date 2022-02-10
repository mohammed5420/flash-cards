const mongoose = require("mongoose");
const moment = require("moment");
const {reminder} = require("./../utils/reminderAfter")

//FlashCard color schema
const colorPaletteSchema = new mongoose.Schema({
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
const flashCardSchema = new mongoose.Schema({
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
  showAt: {
    type: Date,
    default: () => Date.now()
  },
  canPlay: {
    type: Boolean,
    default: false,
  },
  remindAfter: {
    type: Number,
    default: 1
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

flashCardSchema.methods.updateShowAtDate = async function(id) {
  await mongoose.model('card').updateOne({_id: id},{$set: {showAt: moment().add(this.remindAfter, "d").toISOString(),remindAfter: reminder(this.remindAfter)}});
}

module.exports = mongoose.model("card", flashCardSchema);
