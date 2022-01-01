const FlashCard = require("../models/FlashCard");
const verifyToken = require("./../middleware/verifyToken");
const {
  createFlashcardValidator,
  updateFlashCardValidator,
} = require("./../validation");
/**
 * ### TODO: Flash Cards Routes
 * #### 1- Get All flash cards
 * #### 2- Create new flash card
 * #### 3- Update flash card by card ID
 * #### 4- Delete flash card by card ID
 */

const routes = require("express").Router();

/**
 * 1- Fetch All user Flash cards
 */
routes.get("/", async (req, res) => {
  try {
    const flashCards = await FlashCard.find();
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

/**
 * 2- Create new flash card
 */

routes.post("/create", verifyToken ,async (req, res) => {
  const { value, error } = createFlashcardValidator(req.body);
  console.log(req.body, error);
  if (error) {
    return res.json({ message: error.details[0].message });
  }
  const card = new FlashCard(value);
  try {
    const savedCard = await card.save();
    res.json(savedCard);
  } catch (err) {
    res.json({ message: err.message });
  }
});

/**
 * 3- Update flash card by card ID
 */

routes.patch("/update/:card_id", verifyToken ,async (req, res) => {
  console.log(req.user);
  const _id = req.params.card_id;
  //check if card id param exist
  if (!_id)
    return req.json({ message: "you should pass card id as a prameter" });
  //validate request body data
  const { value, error } = updateFlashCardValidator({_id});

  if (error) return res.json({ message: error.details[0].message });

  const createUpdateObject = (reqBody) => {
    if (reqBody.frontside && reqBody.baskside)
      return {
        frontside: reqBody.frontside,
        backside: reqBody.backside,
      };

    if (reqBody.frontside) return { frontside: reqBody.frontside };

    if (reqBody.backside) return { backside: reqBody.backside };
    return res.json({message: "please make sure you pass valid data"})
  };

  try {
    const flashCards = await FlashCard.updateOne(
      { _id },
      { $set: createUpdateObject(req.body) }
    );
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

/**
 * 4- Remove flash card by ID
 */
routes.delete("/delete/:card_id", verifyToken , async (req, res) => {
  //TODO: validate flashcard id
  try {
    const flashCards = await FlashCard.deleteOne({ _id: req.params.card_id });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = routes;
