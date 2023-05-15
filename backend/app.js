const express = require("express");
const authRouter = require("./routes/auth.js");
const boardRouter = require("./routes/board.js");
const teamRouter = require("./routes/team.js");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.use(boardRouter, authRouter, teamRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
