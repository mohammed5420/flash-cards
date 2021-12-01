const app = require("express")();
require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.CONNECTION_STRING,() => {
    console.log("connected to mongoooo!");
});

app.get("/flashcards/api/v1/", (req , res) => {
    res.send("please make sure you are authentifecated");
});

const port = process.env.PORT || 3300;

app.listen(port, () => {
    console.log("server runing on port 3300");
})