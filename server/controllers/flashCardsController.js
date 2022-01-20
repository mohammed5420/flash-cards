const {
  updateFlashCardValidator,
  createFlashcardValidator,
} = require("../validation");
const FlashCard = require("../models/FlashCard");
const AppError = require("./../utils/errorsHandler")
const catchAsync = require("./../utils/catchAsync");

//get All Cards
exports.getAllFlashCards = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  //page 1 (1 -- 10) page 2 (11 -- 20)
  const skip = (page - 1) * limit;
  const flashCards = await FlashCard.find({ authorID: _id })
    .skip(skip)
    .limit(limit);
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
exports.createFlashCard = catchAsync(async (req, res,next) => {
  const { value, error } = createFlashcardValidator(req.body);
  const { _id } = req.user;
  if (error) {
    return next(new AppError(error.details[0].message ),500)
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
exports.deleteFlashCard = catchAsync(async (req, res,next) => {
  // validate flashcard id
  const { _id: authorID } = req.user;
  const _id = req.params.card_id;
  if (!_id) return next(new AppError("card id parameter is missing"),204);

  await FlashCard.deleteOne({ _id, authorID });
  res
    .status(201)
    .json({ status: "success", message: "card deleted successfully" });
});

//get All FavoriteCards
exports.getFavoriteFlashCards = catchAsync(async (req, res) => {
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
exports.updateFlashCard = catchAsync(async (req, res,next) => {
  const {_id} = req.params;
  //check if card id param exist
  if (!_id)
    return req.json({ message: "you should pass card id as a parameter" });
  //validate request body data
  const { value, error } = updateFlashCardValidator(req.body);
  console.log(error);

  if (error) return  next(new AppError(error.details[0].message ),406);

  try {
    const flashCards = await FlashCard.updateOne({ _id }, { $set: value });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});
