const FlashCard = require("../models/FlashCard");
/**
 * ### Flash Cards Routes
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

routes.post("/create", async (req, res) => {
  const card = new FlashCard({
    author: req.body.author,
    frontside: req.body.frontside,
    backside: req.body.backside,
  });
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

routes.patch("/update/:card_id", async (req, res) => {
  const createUpdateObject = (reqBody) => {
    if (reqBody.frontside && reqBody.baskside) {
      return {
        frontside: reqBody.frontside,
        backside: reqBody.backside,
      };
    }

    if (reqBody.frontside) {
      return {
        frontside: reqBody.frontside,
      };
    }

    if (reqBody.backside) {
      return { backside: reqBody.backside };
    }
  };
  console.log(createUpdateObject(req.body))
  try {
    const flashCards = await FlashCard.updateOne(
      { _id: req.params.card_id },
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

routes.delete("/delete/:card_id", async (req, res) => {
  try {
    const flashCards = await FlashCard.deleteOne({ _id: req.params.card_id });
    res.json(flashCards);
  } catch (err) {
    res.json({ message: err.message });
  }
});

module.exports = routes;
