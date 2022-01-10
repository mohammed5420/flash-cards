const {
  updateFlashCardValidator,
  createFlashcardValidator,
} = require("../validation");
const FlashCard = require("../models/FlashCard");

//get All Cards
exports.getAllFlashCards = async (req, res) => {
  const { _id } = req.user;
  try {
    const flashCards = await FlashCard.find({ authorID: _id });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//TODO: create flashCard
exports.createFlashCard = async (req, res) => {
  const { value, error } = createFlashcardValidator(req.body);
  const { _id } = req.user;

  if (error) {
    return res.json({ message: error.details[0].message });
  }
  const card = new FlashCard({
    authorID: _id,
    frontSide: value.frontSide,
    backSide: value.backSide,
  });
  try {
    const savedCard = await card.save();
    res.json(savedCard);
  } catch (err) {
    res.json({ message: err.message });
  }
};

// delete FlashCard
exports.deleteFlashCard = async (req, res) => {
  // validate flashcard id
  const { _id: authorID } = req.user;
  const _id = req.params.card_id;
  if (!_id) return res.json({ message: "unexpected card id" });
  try {
    const flashCards = await FlashCard.deleteOne({ _id, authorID });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
};

//get All FavoriteCards
exports.getFavoriteFlashCards = async (req, res) => {
  const userID = req.user._id;
  const favoriteFlashCards = await FlashCard.find({
    authorID: userID,
    isFavorite: true,
  });

  res.json(favoriteFlashCards);
};

//update flashCard
exports.updateFlashCard = async (req, res) => {
  const _id = req.params.card_id;
  //check if card id param exist
  if (!_id)
    return req.json({ message: "you should pass card id as a parameter" });
  //validate request body data
  const { value, error } = updateFlashCardValidator(req.body);
  console.log(error);

  if (error) return res.json({ message: error.details[0].message });

  try {
    const flashCards = await FlashCard.updateOne({ _id }, { $set: value });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
};
