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
	const { isOpen, name } = req.body;
	try {
		const updatedTeam = await prisma.team.update({
			where: {
				id: teamId,
			},
			data: {
				isOpen,
				name,
			},
		});
		return res.status(200).json(updatedTeam);
	} catch (error) {
		console.error("Error updating team:", error);
		return res.status(500).json({ error: "Error updating team." });
	}
});

// Add user to team
teamRouter.post("/teams/:teamId/add-user", verifyToken, async (req, res) => {
	const { teamId } = req.params;

	try {
		// Find the team by ID
		const team = await prisma.team.findUnique({
			where: {
				id: teamId,
			},
			include: {
				members: true,
			},
		});

		// Check if the team exists
		if (!team) {
			return res.status(404).json({ error: "Team not found." });
		}

		// Check if the authenticated user is the owner of the team
		if (team.ownerId === req.user.id) {
			return res
				.status(400)
				.json({ error: "Team owner can't be added as member of team" });
		}

		const userId = req.user.id;

		// Find the user by ID
		const user = await prisma.user.findUnique({
			where: {
				id: userId,
			},
		});

		// Check if the user exists
		if (!user) {
			return res.status(404).json({ error: "User not found." });
		}

		// Check if the user is already a member of the team
		const isMember = team.members.some((member) => member.userId === user.id);
		if (isMember) {
			return res
				.status(400)
				.json({ error: "User is already a member of the team." });
		}

		// Add the user to the team
		await prisma.user_Team.create({
			data: {
				userId: user.id,
				teamId: team.id,
			},
		});

		return res
			.status(200)
			.json({ message: "User added to the team successfully." });
	} catch (error) {
		console.error("Error adding user to team:", error);
		return res.status(500).json({ error: "Error adding user to team." });
	}
});

// delete team endpoint
teamRouter.delete("/teams/:teamId", verifyToken, async (req, res) => {
	const { teamId } = req.params;
	try {
		// delete all user_team entries for this team
		await prisma.user_Team.deleteMany({
			where: {
				teamId: teamId,
			},
		});

		// get all boards of this team
		const boards = await prisma.board.findMany({
			where: {
				teamId: teamId,
			},
			include: {
				sheets: true,
			},
		});
		// delete all sheets and permissions for the boards of this team
		for (const board of boards) {
			await prisma.sheet.deleteMany({
				where: {
					boardId: board.id,
				},
			});

			await prisma.permission.deleteMany({
				where: {
					boardId: board.id,
				},
			});
		}

		// delete all board entries for this team
		await prisma.board.deleteMany({
			where: {
				teamId: teamId,
			},
		});
		const deletedTeam = await prisma.team.delete({
			where: {
				id: teamId,
			},
		});

		return res.status(200).json(deletedTeam);
	} catch (error) {
		console.error("Error deleting team:", error);
		return res.status(500).json({ error: "Error deleting team." });
	}
});

module.exports = teamRouter;
