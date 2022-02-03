const mongoose = require("mongoose");

const GameSchema = mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "users",
  },
  gameHistory: [
    {
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
  createdAt : {
    type: Date,
    default: () => Date.now()
  }
});

module.exports = mongoose.model("card", GameSchema);
