const http = require("http");
const express = require("express");
const server = express();
const app = http.createServer(server);

const socketIo = require("socket.io");
const handleSockets = require("./socketHandler");

const mongoose = require("mongoose");
const customEnv = require("custom-env");
customEnv.env(process.env.NODE_ENV, "./config");
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bodyParser = require("body-parser");
server.use(bodyParser.urlencoded({ extended: true, limit: "25mb" }));
// Middleware to parse JSON bodies
server.use(express.json());

const cors = require("cors");
server.use(cors());

const routes = require('./routes.js');
server.use("/", routes);

const io = socketIo(app);
handleSockets(io);

app.listen(process.env.PORT, () => console.log("Server running on port 4000"));
