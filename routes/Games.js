const gamesController = require("../controllers/gamesController");

//TODO: Flash-Cards Games Routes
const route = require("express").Router();

//Main Route flash-cards/games

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - gameHistory
 *         - playerId
 *         - highestScore
 *         - lastGameScore
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the game document
 *         playerId:
 *           type: date
 *           description: The date when the game played
 *         gameHistory:
 *           type: array
 *           description: A single game document
 *           items:
 *             type: object
 *             properties:
 *               wrongAnswers:
 *                 type: object
 *                 description: The IDs of all wrong cards in single game
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID reference to Card 
 *               score:
 *                 type: number
 *                 description: The score of single game
 *               playedAt: 
 *                 type: date
 *                 description: Date when the game played
 *         highestScore:
 *           type: boolean
 *           description: The highest score user gets
 *         lastGameScore:
 *           type: boolean
 *           description: The score of last game played
 *         createdAt:
 *           type: date
 *           description: The date of creating this document
 */

route
    .get("/qa",gamesController.getGameCards)
    .post("/qa", gamesController.saveGameStats)
    .patch("/qa", gamesController.updateGameStats)

route   
    .get("/qa/game-history",gamesController.getGameHistory)
    .get("/qa/wrong-cards",gamesController.getFailedCards)
    .delete("/qa/delete-history", gamesController.deleteGameHistory)
module.exports = route;
    