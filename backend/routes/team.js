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

	const ownedTeams = user.ownedTeams;
	const memberTeams = user.memberOfTeams.map((membership) => membership.team);

	res.status(200).json({ ownedTeams, memberTeams });
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

// get team details
teamRouter.get("/teams/:teamId", verifyToken, async (req, res) => {
	const { teamId } = req.params;
	try {
		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
		});
		return res.status(200).json(team);
	} catch (error) {
		console.error("Error getting team:", error);
		return res.status(500).json({ error: "Error getting team." });
	}
});

// patch team details
teamRouter.patch("/teams/:teamId", verifyToken, async (req, res) => {
	const { teamId } = req.params;
	const { isOpen } = req.body;
	try {
		const updatedTeam = await prisma.team.update({
			where: {
				id: teamId,
			},
			data: {
				isOpen,
			},
		});
		return res.status(200).json(updatedTeam);
	} catch (error) {
		console.error("Error updating team:", error);
		return res.status(500).json({ error: "Error updating team." });
	}
});

module.exports = teamRouter;
