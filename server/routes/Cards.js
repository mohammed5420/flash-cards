const flashcardsController = require("./../controllers/flashCardsController");

const routes = require("express").Router();

routes
  .get("/", flashcardsController.getAllFlashCards)
  .post("/create", flashcardsController.createFlashCard)
  .patch("/update/:card_id", flashcardsController.updateFlashCard)
  .delete("/delete/:card_id", flashcardsController.deleteFlashCard);

routes.get("/favorite", flashcardsController.getFavoriteFlashCards);

module.exports = routes;
