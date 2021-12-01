const app = require("express")();
const mongoose = require("./db.config");
const authRoutes = require("./routes/Auth");
const flashCardRoutes = require("./routes/Cards");
require("dotenv").config();

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