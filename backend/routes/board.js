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

module.exports = boardRouter;
