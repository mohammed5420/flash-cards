//TODO: create middleware to verify jwt tokens 
//TODO: add verifyToken middleware to all protected routes
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if(!bearerHeader) return res.sendStatus(403).json({message: "Forbidden"});
    const token = bearerHeader.split(" ")[1];
    try {
        const user = jwt.verify(token,process.env.SECRETKEY);
        req.user = user;
        return next();
    } catch (err) {
        return res.status(403).json({message: "Forbidden!"});
    }
}

module.exports = verifyToken;