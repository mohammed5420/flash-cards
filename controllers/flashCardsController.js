const {
  updateFlashCardValidator,
  createFlashcardValidator,
} = require("../validation");
const FlashCard = require("../models/FlashCard");
const AppError = require("./../utils/errorsHandler");
const catchAsync = require("./../utils/catchAsync");

//get All Cards
exports.getAllFlashCards = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  //page 1 (1 -- 10) page 2 (11 -- 20)
  const skip = (page - 1) * limit;
  const flashCards = await FlashCard.find({ authorID: _id })
    .skip(Number(skip))
    .limit(Number(limit));
  if (!flashCards)
    return next(
      new AppError("No favorite card found with that author ID", 404)
    );
  //if user reached page limit
  if (flashCards.length === 0 && page === 1) {
    return res.status(201).json({
      status: "success",
      length: flashCards.length,
      message: "This user has no cards",
    });
  }
  if (flashCards.length === 0 && page > 1) {
    return res.status(201).json({
      status: "success",
      length: flashCards.length,
      message: "Empty page! go back",
    });
  }
  res
    .status(200)
    .json({ status: "success", length: flashCards.length, data: flashCards });
});

//TODO: create flashCard
exports.createFlashCard = catchAsync(async (req, res, next) => {
  const { value, error } = createFlashcardValidator(req.body);
  const { _id } = req.user;
  if (error) {
    return next(new AppError(error.details[0].message, 500));
  }
  const card = new FlashCard({
    authorID: _id,
    frontSide: value.frontSide,
    backSide: value.backSide,
  });

  await card.save();
  res.status(201).json({
    status: "success",
    message: "card created successfully!",
  });
});

// delete FlashCard
exports.deleteFlashCard = catchAsync(async (req, res, next) => {
  // validate flashcard id
  const { _id } = req.user;
  const { cardID } = req.params;
  if (!cardID) return next(new AppError("card id parameter is missing", 204));

  const card = await FlashCard.deleteOne({ cardID, _id });
  if (!card) return next(new AppError("No card found with that ID", 404));
  res
    .status(201)
    .json({ status: "success", message: "card deleted successfully" });
});

//get All FavoriteCards
exports.getFavoriteFlashCards = catchAsync(async (req, res, next) => {
  const { _id } = req.user;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  //page 1 (1 -- 10) page 2 (11 -- 20)
  const skip = (page - 1) * limit;
  const favoriteFlashCards = await FlashCard.find({
    authorID: _id,
    isFavorite: true,
  })
    .skip(skip)
    .limit(limit);
  if (!favoriteFlashCards)
    return next(
      new AppError("No favorite card found with that author ID", 404)
    );
  if (favoriteFlashCards.length === 0 && page === 1) {
    return res.status(201).json({
      status: "success",
      length: favoriteFlashCards.length,
      message: "This user has no cards",
    });
  }
  if (favoriteFlashCards.length === 0 && page > 1) {
    return res.status(201).json({
      status: "success",
      length: favoriteFlashCards.length,
      message: "Empty page! go back",
    });
  }
  res.status(200).json({
    status: "success",
    length: favoriteFlashCards.length,
    data: favoriteFlashCards,
  });
});

//update flashCard
exports.updateFlashCard = catchAsync(async (req, res, next) => {
  const { cardID } = req.params;
  const { _id } = req.user;
  //check if card id param exist
  if (!cardID) return next(new AppError("Card ID is missing", 206));
  //validate request body data
  const { value, error } = updateFlashCardValidator(req.body);
  if (error) return next(new AppError(error.details[0].message, 406));

  const flashCard = await FlashCard.updateOne(
    { _id: cardID, authorID: _id },
    { $set: value }
  );
  if (!flashCard) return next(new AppError("No card found with that ID", 404));
  res
    .status(201)
    .json({ status: "success", message: "Card updated successfully!" });
});
