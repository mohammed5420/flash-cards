const express = require("express");
const app = express();
const flashCardRoutes = require("./routes/Cards");
const authRoutes = require("./routes/Auth");
const gamesRoutes = require("./routes/Games");
const verifyToken = require("./middleware/verifyToken");
require("./db.config");
require("dotenv").config();
const AppError = require("./utils/errorsHandler");
const globalHandler = require("./controllers/errorController");
const userAgent = require("./middleware/userAgent");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip please try again later",
});
//Middleware
app.use("/api", limiter);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(userAgent);

//API Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/flashcards", verifyToken, flashCardRoutes);
app.use("/api/v1/flashcards/games", verifyToken, gamesRoutes);

//Unknown Routes
app.use("*", (res, req, next) => {
  next(new AppError(`Can't found this page ${res.originalUrl}!`, 404));
});
app.use(globalHandler);
//Handle All Application Errors

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log("server runing on port 3300");
});
