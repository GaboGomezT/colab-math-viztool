const express = require("express");
const authRouter = require("./routes/auth.js");
const boardRouter = require("./routes/board.js");
const teamRouter = require("./routes/team.js");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const prisma = require("./db.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(boardRouter, authRouter, teamRouter);

const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"],
		credentials: true,
	},
});

io.on("connection", (socket) => {
	console.log("A user connected");

	socket.on("joinSession", async (boardId) => {
		socket.join(boardId);
		// get board data from prisma
		const boardData = await prisma.board.findUnique({
			where: {
				id: boardId,
			},
			select: {
				history: true,
			},
		});
		// emit board data to client
		// console.log(boardData);
		// get last element of history array
		const lastElement = boardData.history[boardData.history.length - 1];
		io.to(boardId).emit("canvasUpdate", lastElement);
	});

	socket.on("canvasUpdate", async (data, boardId) => {
		if (boardId) {
			const boardData = await prisma.board.findUnique({
				where: {
					id: boardId,
				},
				select: {
					history: true,
				},
			});

			if (boardData.history.length >= 5) {
				boardData.history.shift();
				// apply changes to prisma
				await prisma.board.update({
					where: {
						id: boardId,
					},
					data: {
						history: {
							set: boardData.history,
						},
					},
				});
			}
			console.log(boardData.history.length);
			// Update prisma board and append data to data_history
			await prisma.board.update({
				where: {
					id: boardId,
				},
				data: {
					history: {
						push: data,
					},
				},
			});

			io.to(boardId).emit("canvasUpdate", data);
		}
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
