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
const morgan = require("morgan");
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000,
  message: "too many requests from this ip please try again later",
});

//documentation
const swaggerUi = require("swagger-ui-express");
const swaggerJsDocs = require("swagger-jsdoc");
const {options} = require("./swagger");
const swaggerDoc = swaggerJsDocs(options);

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

if (process.env.NODE_ENV === "development") {
  console.log(process.env.NODE_ENV);
  app.use(morgan("dev"));
}


//API Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/flashcards", verifyToken, flashCardRoutes);
app.use("/api/v1/flashcards/games", verifyToken, gamesRoutes);

//swagger documentation
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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
