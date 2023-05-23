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
	});

	socket.on("canvasClientUpdate", async (pathObject, boardId, sheetId) => {
		// Update prisma board and append data to data_history
		await prisma.sheet.update({
			where: {
				id: sheetId,
			},
			data: {
				history: {
					push: pathObject,
				},
			},
		});

		io.to(boardId).emit("canvasServerUpdate", pathObject, sheetId);
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
