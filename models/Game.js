const mongoose = require("mongoose");
const gameHistory = mongoose.Schema({
  wrongAnswers: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "card"
    },
  ],
  score: { type: Number, required: true },
  playedAt: {
    type: Date,
    default: () => Date.now(),
  },
});
const GameSchema = mongoose.Schema({
  playerId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "users",
  },
  gameHistory: [gameHistory],
  highestScore: {
    type: Number,
    required: true,
  },
  lastGameScore: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model("Game", GameSchema);
