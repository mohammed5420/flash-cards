const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorsHandler");
const Card = require("./../models/FlashCard");
const Game = require("./../models/Game");
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

exports.saveGameStats = catchAsync(async (req, res, next) => {});

/**
 * Update game history
 */

exports.updateGameStats = catchAsync(async (req, res, next) => {});

/**
 * Delete Game history
 */

exports.deleteGameStats = catchAsync(async (req, res, next) => {});
