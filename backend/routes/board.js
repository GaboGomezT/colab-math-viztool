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
	const { name, teamId } = req.body;

	if (!name) {
		return res.status(400).json({ error: "Missing required fields: name" });
	}

	try {
		const boardData = {
			name,
			owner: { connect: { id: req.user.id } },
			...(teamId ? { team: { connect: { id: teamId } } } : {}),
			// Create a single sheet for the new board
			sheets: {
				create: [{ history: [] }],
			},
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

// board detail route
boardRouter.get("/boards/:boardId", verifyToken, async (req, res) => {
	const { boardId } = req.params;
	try {
		const board = await prisma.board.findUnique({
			where: {
				id: boardId,
			},
			include: {
				sheets: true,
				team: {
					include: {
						members: {
							select: {
								member: true,
							},
						},
					},
				},
				permissions: true,
			},
		});

		// Here you can map through the team members to only return the user information
		if (board.team) {
			board.team.members = board.team.members.map((user_team) => {
				return {
					id: user_team.member.id,
					firstName: user_team.member.firstName,
					lastName: user_team.member.lastName,
				};
			});
		}

		return res.status(200).json(board);
	} catch (error) {
		console.error("Error retrieving board:", error);
		return res.status(500).json({ error: "Error retrieving board." });
	}
});

// route to create new sheet
boardRouter.post("/boards/:boardId/sheets", verifyToken, async (req, res) => {
	const { boardId } = req.params;

	try {
		const newSheet = await prisma.sheet.create({
			data: {
				board: {
					connect: {
						id: boardId,
					},
				},
				history: [],
			},
		});
		res.status(201).json(newSheet);
	} catch (error) {
		console.error("Error creating sheet:", error);
		res.status(500).json({ error: "Error creating sheet." });
	}
});

// patch route to update board name
boardRouter.patch("/boards/:boardId", verifyToken, async (req, res) => {
	const { boardId } = req.params;
	const { name } = req.body;

	try {
		const updatedBoard = await prisma.board.update({
			where: {
				id: boardId,
			},
			data: {
				name,
			},
		});
		res.status(200).json(updatedBoard);
	} catch (error) {
		console.error("Error updating board:", error);
		res.status(500).json({ error: "Error updating board." });
	}
});

// delete route to delete board
boardRouter.delete("/boards/:boardId", verifyToken, async (req, res) => {
	const { boardId } = req.params;

	try {
		// delete all sheets associated with board
		await prisma.sheet.deleteMany({
			where: {
				boardId: boardId,
			},
		});

		// delete all permissions associated with board
		await prisma.permission.deleteMany({
			where: {
				boardId: boardId,
			},
		});

		const deletedBoard = await prisma.board.delete({
			where: {
				id: boardId,
			},
		});
		res.status(200).json(deletedBoard);
	} catch (error) {
		console.error("Error deleting board:", error);
		res.status(500).json({ error: "Error deleting board." });
	}
});

module.exports = boardRouter;
