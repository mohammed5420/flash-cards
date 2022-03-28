const gamesController = require("../controllers/gamesController");

//TODO: Flash-Cards Games Routes
const route = require("express").Router();

//Main Route flash-cards/games
route
    .get("/qa",gamesController.getGameCards)
    .post("/qa", gamesController.saveGameStats)
    .patch("/qa", gamesController.updateGameStats)

route   
    .get("/qa/game-history",gamesController.getGameHistory)
    .get("/qa/wrong-cards",gamesController.getFailedCards)
    .delete("/qa/delete-history", gamesController.deleteGameHistory)
module.exports = route;
    