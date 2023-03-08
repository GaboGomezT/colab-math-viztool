const express = require("express");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyToken = require("./middleware");

dotenv.config();

const app = express();
const secretKey = process.env.ACCESS_TOKEN_SECRET;

app.get("/", (req, res) => {
  res.send("Welcome to the Express app.");
});

app.post("/login", (req, res) => {
  const user = {
    id: 1,
    username: "user1",
    email: "user1@email.com",
  };

  // Create and sign the JWT
  const token = jwt.sign({ user }, secretKey, { expiresIn: "1h" });
  res.header("x-access-token", token).send({
    success: true,
    message: "Login successful.",
    token,
  });
});

app.get("/protected", verifyToken, (req, res) => {
  res.send("Protected route accessed.");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
