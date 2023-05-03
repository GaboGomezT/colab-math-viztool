const prisma = require("../db.js");

const express = require("express");
const verifyToken = require("../middleware.js");
const boardRouter = express.Router();

boardRouter.get("/boards", verifyToken, async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
	});
	console.log(user);

	res.send("Protected route accessed.");
});

module.exports = boardRouter;
