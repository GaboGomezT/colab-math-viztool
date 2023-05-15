const prisma = require("../db.js");

const express = require("express");
const verifyToken = require("../middleware.js");
const teamRouter = express.Router();

teamRouter.get("/teams", verifyToken, async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
		include: {
			ownedTeams: true,
			memberOfTeams: {
				include: {
					team: true,
				},
			},
		},
	});
	const teams = [
		...user.ownedTeams,
		...user.memberOfTeams.map((membership) => membership.team),
	];

	res.status(200).json({ teams });
});

teamRouter.post("/teams", verifyToken, async (req, res) => {
	const { name } = req.body;

	if (!name) {
		return res.status(400).json({ error: "Missing required field: name" });
	}

	try {
		const newTeam = await prisma.team.create({
			data: {
				name,
				owner: {
					connect: {
						id: req.user.id,
					},
				},
			},
		});

		return res.status(201).json(newTeam);
	} catch (error) {
		console.error("Error creating team:", error);
		return res.status(500).json({ error: "Error creating team." });
	}
});

module.exports = teamRouter;
