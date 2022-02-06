const { getGameCards, saveGameStats, updateGameStats, deleteGameStats, getGameHistory } = require("../controllers/gamesController");

//TODO: Flash-Cards Games Routes
const route = require("express").Router();

//Main Route flash-cards/games
route
    .get("/qa",getGameCards)
    .post("/qa", saveGameStats)
    .patch("/qa", updateGameStats)
    .delete("/qa", deleteGameStats)

route   
    .get("/qa/gamehistory",getGameHistory);
module.exports = route;
    