const express = require("express");
const authRouter = require("./routes/auth.js");
const boardRouter = require("./routes/board.js");
const teamRouter = require("./routes/team.js");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const prisma = require("./db.js");
const uuid = require("uuid");

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
	socket.on("joinSession", async (boardId) => {
		socket.join(boardId);
		console.log("A user connected to board ", boardId);
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

		// update board modified field to current time
		await prisma.board.update({
			where: {
				id: boardId,
			},
			data: {
				modified: new Date(),
			},
		});

		io.to(boardId).emit("canvasServerUpdate", pathObject, sheetId);
	});

	// recieve permission change from client
	socket.on(
		"permissionsClientUpdate",
		async (userId, boardId, newPermission) => {
			// First, find the permission record
			const permission = await prisma.permission.findFirst({
				where: {
					userId: userId,
					boardId: boardId,
				},
			});

			if (!permission) {
				// create a new permission record
				await prisma.permission.create({
					data: {
						access: newPermission,
						user: {
							connect: {
								id: userId,
							},
						},
						board: {
							connect: {
								id: boardId,
							},
						},
					},
				});
			} else {
				// Then, update the permission
				await prisma.permission.update({
					where: {
						id: permission.id,
					},
					data: {
						access: newPermission,
					},
				});
			}

			io.to(boardId).emit("permissionsServerUpdate", userId, newPermission);
		}
	);

	// recieve creation of graph in sheet from client
	socket.on("createGraph", async (data) => {
		// create UUID for graph
		const newGraph = {
			id: uuid.v4(),
			name: data.name,
			args: data.args,
			sheetId: data.sheetId,
		};
		// add graph to sheet
		await prisma.sheet.update({
			where: {
				id: data.sheetId,
			},
			data: {
				graphs: {
					push: newGraph,
				},
			},
		});

		io.to(data.boardId).emit("graphCreated", newGraph);
	});

	// recieve deletion of graph in sheet from client
	socket.on("deleteGraph", async (data) => {

		// get all graphs in sheet
		const sheet = await prisma.sheet.findUnique({
			where: {
				id: data.sheetId,
			}
		});

		// filter out graph to be deleted
		const newGraphs = sheet.graphs.filter((graph) => {
			return graph.id !== data.graphId;
		});

		// update sheet with new graphs
		await prisma.sheet.update({
			where: {
				id: data.sheetId,
			},
			data: {
				graphs: {
					set: newGraphs,
				},
			},
		});


		io.to(data.boardId).emit("graphDeleted", data.graphId);
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
