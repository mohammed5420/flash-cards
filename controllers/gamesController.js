const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorsHandler");
const Card = require("./../models/FlashCard");
const Game = require("./../models/Game");
const { gameStatsValidator } = require("./../validation");
//TODO: Flash-Card Games controller

/**
 * Serve random cards
 */
exports.getGameCards = catchAsync(async (req, res, next) => {
  //Get Random Cards using user id
  const { _id } = req.user;
  const Cards = await Card.find({ authorID: _id })
    .sort({ createdAt: 1 })
    .limit(5);
  console.log(_id);
  // Create Response Object
  if (!Cards || Cards.length === 0)
    return next(new AppError("there is no flashcards please add cards", 406));

  const resObject = {
    status: "success",
    data: Cards,
    length: Cards.length,
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
  console.log(error);
  if (error) return next(new AppError("Invalid game history", 403));
  //check if user hse pervious game history
  const gameHistoryObject = await Game.findOne({ playerId: _id });
  if (!gameHistoryObject) {
    const gameStats = new Game({
      playerId: _id,
      gameHistory: [
        {
          wrongCards: value.wrongCards,
          score: value.score,
        },
      ],
      highestScore: value.score,
      lastGameScore: value.score,
    });
    console.log(gameStats);
    //save the user to database
    const savedGameStats = await gameStats.save();
    return res.status(201).json({ status: "success", data: savedGameStats });
  }

  const updateObject = {
    gameHistory: {
      wrongCards: value.wrongCards,
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
  console.log(updatedGameHistory);
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
  const gameHistory = await Game.findOne({ playerId: _id }).populate("playerId").populate("gameHistory.wrongCards");
  if (!gameHistory) {
    return res
      .status(204)
      .json({
        status: "success",
        message: "this user's game history is empty play some games xd",
      });
  }
  console.log(gameHistory);
  //send game history to the user
  return res.status(200).json({status: "success",data: gameHistory});
});

/**
 * Update game history
 */

exports.updateGameStats = catchAsync(async (req, res, next) => {});

/**
 * Delete Game history
 */

exports.deleteGameStats = catchAsync(async (req, res, next) => {});
