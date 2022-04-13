const flashcardsController = require("./../controllers/flashCardsController");

const routes = require("express").Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       required:
 *         - authorID
 *         - frontSide
 *         - backSide
 *         - colorPalette
 *       properties:
 *         id:
 *            type: string
 *            description: The auto-generated id of the game document
 *         authorID:
 *            type: string
 *            description: ID reference to user document
 *         frontSide:
 *            type: string
 *            description: The front side of the flashcard
 *         backSide:
 *            type: string
 *            description: The back side of the flashcard
 *         showAt:
 *            type: date
 *            description: The date to show the flashcard to the user
 *         remindAfter:
 *            type: integer
 *            description: Number to show the flashcard after passing specific time
 *         colorPalette:
 *            type: object
 *            properties:
 *               frontSide:
 *                  type: string
 *                  description: HEX code color for the front side of the flashcard
 *               backSide:
 *                  type: string
 *                  description: HEX code color for the back side of the flashcard
 *         isFavorite:
 *            type: boolean
 *            description: Is the flashcard in favorite list
 *         createdAt:
 *            type: date
 *            description: The Date when the document was created
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: get all flashcards
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The length of the documents in the response
 *     tags: [Card]
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

routes.get("/", flashcardsController.getAllFlashCards);

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Card]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               frontSide:
 *                 type: string
 *                 description: The front side of the flashcard
 *               backSide:
 *                 type: string
 *                 description: the backside of the flashcard
 *               colorPalette:
 *                 type: object
 *                 properties:
 *                   frontSide:
 *                      type: string
 *                      description: HEX code color for the front side of the flashcard
 *                   backSide:
 *                      type: string
 *                      description: HEX code color for the back side of the flashcard
 *     responses:
 *       200:
 *         description: Flashcard create successfully
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

routes.post("/create", flashcardsController.createFlashCard);

/**
 * @swagger
 * /update/{cardID}:
 *   patch:
 *     summary: Update flashcard
 *     parameters:
 *        - in: path
 *          name: cardID
 *          required: true
 *          description: ID of the flashcard
 *          schema:
 *            type: string
 *     tags: [Card]
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              description: contains all the values that needs to be updated
 *     responses:
 *       200:
 *         description: flashcard update successfully!
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

routes.patch("/update/:cardID", flashcardsController.updateFlashCard);

/**
 * @swagger
 * /delete/{cardID}:
 *   delete:
 *     summary: Delete flashcard
 *     parameters:
 *       - in: path
 *         name: cardID
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the flashcard
 *     tags: [Card]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: flashcard deleted successfully!
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

routes.delete("/delete/:cardID", flashcardsController.deleteFlashCard);

/**
 * @swagger
 * /favorite:
 *   get:
 *     summary: Get all favorite flashcards
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The length of the documents in the response
 *     tags: [Card]
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: list of favorite flashcards
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
 *                   description: The list of the favorite flashcards
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

routes.get("/favorite", flashcardsController.getFavoriteFlashCards);

module.exports = routes;
