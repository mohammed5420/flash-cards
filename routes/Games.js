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

/**
 * @swagger
 * /flashcards/games/qa:
 *   get:
 *     summary: Get game's cards
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The length of the documents in the response object
 *     tags: [Game]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: list of flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 length:
 *                   type: integer
 *                   description: request status
 *                 data:
 *                   type: array
 *                   description: The list of the flashcards
 *                   items:
 *                      schema:
 *                         $ref: '#/components/schemas/Card'
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 */
route.get("/qa", gamesController.getGameCards);
/**
 * @swagger
 * /flashcards/games/qa:
 *   post:
 *     summary: Receive game statistics
 *     tags: [Game]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               correctAnswers:
 *                 type: array
 *                 description: Array of correct flashcards ids
 *               wrongAnswers:
 *                 type: string
 *                 description: Array of wrong flashcards ids
 *     responses:
 *       200:
 *         description: game stats saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *                 invalidInput:
 *                   type: array
 *                   description: Array of invalid inputs
 *       500:
 *         description: Some server error
 */
route.post("/qa", gamesController.saveGameStats);
/**
 * @swagger
 * /flashcards/games/qa/game-history:
 *   get:
 *     summary: Stats about games history
 *     tags: [Game]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: object contains user games history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 */
route.get("/qa/game-history", gamesController.getGameHistory);
/**
 * @swagger
 * /flashcards/games/qa/wrong-cards:
 *   get:
 *     summary: list of wrong flashcards
 *     tags: [Game]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: list of wrong flashcards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 length:
 *                   type: integer
 *                   description: request status
 *                 data:
 *                   type: array
 *                   description: The list of the flashcards
 *                   items:
 *                      schema:
 *                         $ref: '#/components/schemas/Card'
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 */

route.get("/qa/wrong-cards", gamesController.getFailedCards);
/**
 * @swagger
 * /flashcards/games/qa/delete-history:
 *   delete:
 *     summary: Delete user games history
 *     tags: [Game]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: History was deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       406:
 *         description: invalid data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: request status
 *                 message:
 *                   type: string
 *       500:
 *         description: Some server error
 */
route.delete("/qa/delete-history", gamesController.deleteGameHistory);
module.exports = route;
