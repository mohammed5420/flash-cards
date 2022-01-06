const express = require("express");
const app = express();
const flashCardRoutes = require("./routes/Cards");
const authRoutes = require("./routes/Auth");
const verifyToken = require("./middleware/verifyToken");
require("./db.config");
require("dotenv").config();

//Middleware
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//API Routes
app.use("/users", authRoutes);
app.use("/flashcards",verifyToken ,flashCardRoutes);

app.get("/flashcards/api/v1/", (req, res) => {
  res.send("please make sure you are authenticated");
});

const port = process.env.PORT || 3300;

app.listen(port, () => {
  console.log("server runing on port 3300");
});
