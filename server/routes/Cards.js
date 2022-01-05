const FlashCard = require("../models/FlashCard");
const verifyToken = require("./../middleware/verifyToken");
const {
  createFlashcardValidator,
  updateFlashCardValidator,
  IDValidator,
  isFavoriteCardValidator,
} = require("./../validation");
/**
 * ### TODO: Flash Cards Routes
 * #### 1- Get All flash cards
 * #### 2- Create new flash card
 * #### 3- Update flash card by card ID
 * #### 4- Delete flash card by card ID
 * #### 5- Create favorite cards route
 */

const routes = require("express").Router();

/**
 * Fetch All user Flash cards
 */
routes.get("/", verifyToken, async (req, res) => {
  const { _id } = req.user;
  try {
    const flashCards = await FlashCard.find({ authorID: _id });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

/**
 * Create new flash card
 */

routes.post("/create", verifyToken, async (req, res) => {
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
});

/**
 * Update flash card by card ID
 */

routes.patch("/update/:card_id", verifyToken, async (req, res) => {
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
});

/**
 * Create favorite flashCards route
 */
routes.get("/favorite", verifyToken, async (req, res) => {
  const userID = req.user._id;
  const favoriteFlashCards = await FlashCard.find({
    authorID: userID,
    isFavorite: true,
  });

  res.json(favoriteFlashCards);
});

/**
 * Remove flash card by ID
 */
routes.delete("/delete/:card_id", verifyToken, async (req, res) => {
  //TODO: validate flashcard id
  const { _id: authorID } = req.user;
  const _id = req.params.card_id;
  if (!_id) return res.json({ message: "unexpected card id" });
  try {
    const flashCards = await FlashCard.deleteOne({ _id, authorID });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = routes;
