const prisma = require("../db.js");

const express = require("express");
const verifyToken = require("../middleware.js");
const boardRouter = express.Router();

boardRouter.get("/boards", verifyToken, async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id,
		},
		include: {
			ownedBoards: true,
			memberOfTeams: {
				include: {
					team: {
						include: {
							boards: true,
						},
					},
				},
			},
		},
	});
	// Extract ownedBoards
	const ownedBoards = user.ownedBoards;

	// Extract teamBoards
	const teamBoards = user.memberOfTeams.flatMap(
		(userTeam) => userTeam.team.boards
	);

	// Combine and return ownedBoards and teamBoards
	const allBoards = [...ownedBoards, ...teamBoards];
	res.status(200).json({ allBoards });
});

boardRouter.post("/boards", verifyToken, async (req, res) => {
	console.log(req.body);
	const { name, teamId, isPublic } = req.body;

	if (!name) {
		return res.status(400).json({ error: "Missing required fields: name" });
	}

	try {
		const boardData = {
			name,
			owner: { connect: { id: req.user.id } },
			isPublic: isPublic || false,
			...(teamId ? { team: { connect: { id: teamId } } } : {}),
		};

		const newBoard = await prisma.board.create({
			data: boardData,
		});

		res.status(201).json(newBoard);
	} catch (error) {
		console.error("Error creating board:", error);
		res.status(500).json({ error: "Error creating board." });
	}
});

module.exports = boardRouter;
