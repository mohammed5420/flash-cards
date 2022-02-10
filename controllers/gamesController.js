const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorsHandler");
const Card = require("./../models/FlashCard");
const Game = require("./../models/Game");
const moment = require("moment");
const { gameStatsValidator } = require("./../validation");
//TODO: Flash-Card Games controller

/**
 * Serve random cards
 */
exports.getGameCards = catchAsync(async (req, res, next) => {
  //Get Random Cards using user id
  const { _id } = req.user;
  const limit = req.query.limit || 5;
  const currentDate = Date.now();
  const Cards = await Card.find({
    authorID: _id,
    showAt: { $lte: currentDate },
  });
  // Create Response Object
  if (!Cards || Cards.length === 0)
    return next(new AppError("there is no flashcards please add cards", 406));
  const resObject = {
    status: "success",
    data: Cards,
    // length: Cards.length,
  };
  //Send Response Object
  res.status(201).json(resObject);
});

/**
 * Save game history
 */

exports.saveGameStats = catchAsync(async (req, res, next) => {
  //Get user id
  const { _id } = req.user;
  //validate user input
  //TODO: Validate Game Stats
  const { value, error } = gameStatsValidator(req.body);
  if (error) return next(new AppError("Invalid game history", 403));
  //update all correct cards and wrong cards
  const correctCards = await Card.find({ _id: { $in: value.correctAnswers } });
    correctCards.forEach(async (card) => {
      await card.updateShowAtDate(card._id);
    });
  //check if user hse pervious game history
  const gameHistoryObject = await Game.findOne({ playerId: _id });
  if (!gameHistoryObject) {
    const gameStats = new Game({
      playerId: _id,
      gameHistory: [
        {
          wrongAnswers: value.wrongAnswers,
          score: value.score,
        },
      ],
      highestScore: value.score,
      lastGameScore: value.score,
    });
    //save the user to database
    const savedGameStats = await gameStats.save();
    return res.status(201).json({ status: "success", data: savedGameStats });
  }

  const updateObject = {
    gameHistory: {
      wrongAnswers: value.wrongAnswers,
      score: value.score,
    },
    highestScore:
      gameHistoryObject.highestScore > value.score
        ? gameHistoryObject.highestScore
        : value.score,
    lastGameScore: value.score,
  };

  const updatedGameHistory = await Game.updateOne(
    { playerId: _id },
    {
      $push: { gameHistory: updateObject.gameHistory },
      $set: {
        highestScore: updateObject.highestScore,
        lastGameScore: updateObject.lastGameScore,
      },
    }
  );
  return res.status(201).json({
    status: "success",
    message: "game history added successfully !!",
  });
  //Create new Game History

  //Save the game result to game document
});

/**
 * Get Game history
 */

exports.getGameHistory = catchAsync(async (req, res, next) => {
  //Get user Id
  const { _id } = req.user;
  //Find game history with the same user id
  const gameHistory = await Game.findOne({ playerId: _id })
    .populate("playerId")
    .populate("gameHistory.wrongAnswers");
  if (!gameHistory) {
    return res.status(204).json({
      status: "success",
      message: "this user's game history is empty play some games xd",
    });
  }
  //send game history to the user
  return res.status(200).json({ status: "success", data: gameHistory });
});

/**
 * Get All Failed Cards
 */

exports.getFailedCards = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const [wrongAnswers] = await Game.find(
    { playerId: _id },
    { gameHistory: 1 }
  ).populate("gameHistory.wrongAnswers");
  let failedGames = [];
  wrongAnswers.gameHistory.map((card) => {
    failedGames = failedGames.concat(card.wrongAnswers);
  });
  res.json({ data: failedGames });
});

/**
 * Update game history
 */

exports.updateGameStats = catchAsync(async (req, res, next) => {});

/**
 * Delete Game history
 */

exports.deleteGameStats = catchAsync(async (req, res, next) => {});
