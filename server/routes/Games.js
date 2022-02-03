const { getGameCards, saveGameStats, updateGameStats, deleteGameStats } = require("../controllers/gamesController");

//TODO: Flash-Cards Games Routes
const router = require("express").Router();

//Main Route flash-cards/games
router
    .get("/qa",getGameCards)
    .post("/qa", saveGameStats)
    .patch("/qa", updateGameStats)
    .delete("/qa", deleteGameStats)