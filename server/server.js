const express = require("express");
const app = express();
const mongoose = require("./db.config");
const flashCardRoutes = require("./routes/Cards");
require("./routes/Auth");
require("dotenv").config();

//Middlewares
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//API Routes
app.use("/users",authRoutes);
app.use("/flashcards",flashCardRoutes);

app.get("/flashcards/api/v1/", (req , res) => {
    res.send("please make sure you are authentifecated");
});

const port = process.env.PORT || 3300;

app.listen(port, () => {
    console.log("server runing on port 3300");
})