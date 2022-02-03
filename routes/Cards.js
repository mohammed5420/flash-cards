const flashcardsController = require("./../controllers/flashCardsController");

const routes = require("express").Router();

routes
  .get("/", flashcardsController.getAllFlashCards)
  .post("/create", flashcardsController.createFlashCard)
  .patch("/update/:cardID", flashcardsController.updateFlashCard)
  .delete("/delete/:cardID", flashcardsController.deleteFlashCard);

routes.get("/favorite", flashcardsController.getFavoriteFlashCards);

module.exports = routes;
