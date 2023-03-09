const prisma = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");

const authRouter = express.Router();
const secretKey = process.env.ACCESS_TOKEN_SECRET;

authRouter.post("/signup", async (req, res) => {
	const saltRounds = 10;
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
	const newUser = await prisma.user.create({
		data: {
			firstName: req.body.name,
			lastName: req.body.name,
			email: req.body.email,
			encryptedPassword: hashedPassword,
		},
	});

	// Create and sign the JWT
	const accessToken = jwt.sign({ id: newUser.id }, secretKey);
	return res.header("Authorization", accessToken).send(accessToken);
});

authRouter.post("/login", async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});

	if (!user) {
		return res.send("Email Not Found");
	}

	const passwordCompare = bcrypt.compareSync(
		req.body.password,
		user.encryptedPassword
	);
	const accessToken = jwt.sign({ id: user.id }, secretKey);

	if (!passwordCompare) {
		return res.send("Invalid Password");
	} else {
		return res.header("Authorization", accessToken).send(accessToken);
	}
});

module.exports = authRouter;
