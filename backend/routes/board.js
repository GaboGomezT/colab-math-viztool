const express = require("express");
const verifyToken = require("../middleware.js");
const boardRouter = express.Router();

boardRouter.get("/boards", verifyToken, async (req, res) => {
	res.send("Protected route accessed.");
});

module.exports = boardRouter;
