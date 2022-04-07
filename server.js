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
const helmet = require("helmet");
const mongoSanitizer = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip please try again later",
});

//Middleware
//set HTTP security headers
app.use(helmet());

//Prevent to many request from the same ID
app.use("/api", limiter);

//Pars JSON Data
app.use(express.json({ limit: "10KB" }));

//Data sanitizing
app.use(mongoSanitizer());
app.use(xss());

//Pars urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Get User Agent
app.use(userAgent);

//prevent parameters pollution
app.use(hpp());

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
