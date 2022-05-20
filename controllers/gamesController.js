/** App Controller providing related games functions
 * @module controllers/gamesController
 */

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorsHandler");
const Card = require("./../models/FlashCard");
const Game = require("./../models/Game");
const moment = require("moment");
const { gameStatsValidator } = require("./../validation");
//TODO: Flash-Card Games controller

/**
 * Serve random cards
 * @name GET/getGameCards
 * @function
 * @memberof module:controllers/gamesController
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 *
 */
exports.getGameCards = catchAsync(async (req, res, next) => {
  //Get Random Cards using user id
  const { _id } = req.user;
  const limit = req.query.limit || 5;
  const currentDate = Date.now();
  const Cards = await Card.find({
    authorID: _id,
    showAt: { $lte: currentDate },
  }).limit(Number(limit));
  // Create Response Object
  if (!Cards || Cards.length === 0)
    return next(new AppError("there is no flashcards please add cards", 406));
  const resObject = {
    status: "success",
    length: Cards.length,
    data: Cards,
  };
  //Send Response Object
  res.status(201).json(resObject);
});

/**
 * Route to save game history
 * @name post/saveGameStatus
 * @function
 * @memberof module:controllers/gamesController
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
exports.saveGameStats = catchAsync(async (req, res, next) => {
  //Get user id
  const { _id } = req.user;
  //validate user input
  //TODO: Validate Game Stats
  const { value, error } = gameStatsValidator(req.body);
  if (error) return next(new AppError("Invalid game history", 403));

  const intersection = new Set(
    [...value.correctAnswers].filter((card) =>
      new Set(value.wrongAnswers).has(card)
    )
  );

  console.log(intersection);
  if (intersection.size != 0) {
    return res.status(200).json({
      status: "success",
      message: "invalid input: some cards are correct and wrong",
      invalidInput: [...intersection],
    });
  }
  //update all correct cards and wrong cards
  const correctCards = await Card.find({ _id: { $in: value.correctAnswers } });
  correctCards.forEach(async (card) => {
    await card.updateShowAtDate(card._id);
  });
  //check if user hse pervious game history
  const gameHistoryObject = await Game.findOne({ playerId: _id });
  const score = correctCards.length;
  //validation goes here

  if (!gameHistoryObject) {
    const gameStats = new Game({
      playerId: _id,
      gameHistory: [
        {
          wrongAnswers: value.wrongAnswers,
          score: score,
        },
      ],
      highestScore: score,
      lastGameScore: score,
    });
    //save the user to database
    const savedGameStats = await gameStats.save();
    return res.status(201).json({ status: "success", data: savedGameStats });
  }

  const updateObject = {
    gameHistory: {
      wrongAnswers: value.wrongAnswers,
      score: score,
    },
    highestScore:
      gameHistoryObject.highestScore > score
        ? gameHistoryObject.highestScore
        : score,
    lastGameScore: score,
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
    message: "Game stats saved successfully !!",
  });
  //Create new Game History

  //Save the game result to game document
});

/**
 * Route to display user games history
 * @name GET/getGameHistory
 * @function
 * @memberof module:controllers/gamesController
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */
exports.getGameHistory = catchAsync(async (req, res, next) => {
  //Get user Id
  const { _id } = req.user;
  //Find game history with the same user id
  const gameHistory = await Game.findOne({ playerId: _id })
    .populate("playerId")
    .populate("gameHistory.wrongAnswers");

  if (!gameHistory) {
    console.log(gameHistory);
    return res.status(200).json({
      status: "success",
      message: "this user's game history is empty play some games xd",
    });
  }
  //send game history to the user
  return res.status(200).json({ status: "success", data: gameHistory });
});

/**
 * Route to display user wrong cards history
 * @name GET/getFailedCards
 * @function
 * @memberof module:controllers/gamesController
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
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
  const data = [...new Set(failedGames)];
  res.json({ status: "success", length: data.length, data });
});

/**
 * Update game history
 */

// exports.updateGameStats = catchAsync(async (req, res, next) => {});

/**
 * Route to display user wrong cards history
 * @name GET/getFailedCards
 * @function
 * @memberof module:controllers/gamesController
 * @param {string} path - Express path
 * @param {callback} middleware - Express middleware.
 */

exports.deleteGameHistory = catchAsync(async (req, res, next) => {
  const { _id } = req.user;

  await Game.deleteOne({ playerId: _id });
  return res.json({
    status: "success",
    message: "History was deleted successfully",
  });
});
