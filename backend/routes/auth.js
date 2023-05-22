const prisma = require("../db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const authRouter = express.Router();
const secretKey = process.env.ACCESS_TOKEN_SECRET;

authRouter.post("/signup", async (req, res) => {
	const saltRounds = 10;
	// Check if user with the given email already exists
	const userExists = await prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});

	if (userExists) {
		return res.status(400).json({ error: "Email already in use" });
	}
	const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
	const newUser = await prisma.user.create({
		data: {
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			encryptedPassword: hashedPassword,
		},
	});

	// Create and sign the JWT
	const accessToken = jwt.sign({ id: newUser.id }, secretKey);
	firstName = newUser.firstName;
	lastName = newUser.lastName;
	return res
		.header("Authorization", accessToken)
		.send({ accessToken, firstName, lastName });
});

authRouter.post("/login", async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			email: req.body.email,
		},
	});

	if (!user) {
		return res.status(400).json({ error: "Invalid Password or Email" });
	}

	const passwordCompare = bcrypt.compareSync(
		req.body.password,
		user.encryptedPassword
	);
	const accessToken = jwt.sign({ id: user.id }, secretKey);

	if (!passwordCompare) {
		return res.status(400).json({ error: "Invalid Password or Email" });
	} else {
		firstName = user.firstName;
		lastName = user.lastName;
		return res
			.header("Authorization", accessToken)
			.send({ accessToken, firstName, lastName });
	}
});

module.exports = authRouter;
