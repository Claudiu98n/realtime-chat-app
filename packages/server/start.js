const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config();
require("./auth/passport");

const middlewares = require("./middleware/middlewares");
const api = require("./api");

// app setup
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Realtime chat app",
  });
});

app.use("/api", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});

// socket setup
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const { queryByName, queryCreateRoom } = require("./api/services/room.service");
const { queryCreateMessage } = require("./api/services/message.service");

io.on("connection", (socket) => {
  let payload;

  try {
    const token = socket.handshake.headers.authorization?.split(" ")[1];

    if (token === "null") {
      console.log("No authorization for socket with id:", socket.id);
    } else {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    }
  } catch (err) {
    console.log(err);
    socket.disconnect();
  }

  if (payload) {
    console.log("User connected: id:", payload.id + " email:" + payload.email);
  }

  socket.on("join_room", (room) => {
    const joinRoom = async () => {
      try {
        const roomExists = await queryByName(room);

        if (!roomExists) {
          await queryCreateRoom(room);
        }

        socket.join(room);
        console.log(`User with id ${payload.id} joined room: ${room}`);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    joinRoom();
  });

  socket.on("send_message", (data) => {
    const sendMessage = async () => {
      try {
        const room = await queryByName(data.room);

        const message = await queryCreateMessage(data.message, room.id, data.author);

        io.to(data.room).emit("receive_message", message);
      } catch (err) {
        console.log("Error: ", err);
      }
    };

    sendMessage();
  });
});
