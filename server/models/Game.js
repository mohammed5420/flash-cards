const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "users",
  },
  gameHistory: [
    {
      correctAnswers: { type: Number, required: true },
      wrongCards: [
        {
          cardId: {
            type: mongoose.SchemaTypes.ObjectId,
            required: true,
            ref: "card",
          },
        },
      ],
      score: { type: Number },
      playedAt: {
        type: Date,
        default: () => Date.now(),
      },
    },
  ],
  highestScore: {
    type: Number,
    required: true,
  },
  lastGameScore: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("card", GameSchema);
