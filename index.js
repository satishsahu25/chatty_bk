const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const dbconnect = require("./utils/db");
const userrouter = require("./routes/userroutes");
const msgroutes = require("./routes/msgroutes");
const socket = require("socket.io");

const path=require("path");


app.use(cors());
app.use(express.json());

app.use("/",(req,res)=>{
  res.send("hello from server");
})

//apis
app.use("/api/auth", userrouter);
app.use("/api/msg", msgroutes);

const server = app.listen(process.env.PORT, () => {
  dbconnect();
  console.log(`Server is running on port ${process.env.PORT}`);
});




///////socket

const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineusers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("adduser", (userid) => {
    onlineusers.set(userid, socket.id);
  });

  socket.on("sendmsg", (data) => {
    const sendusersocket = onlineusers.get(data.to);
    if (sendusersocket) {
      console.log(data);
      socket.to(sendusersocket).emit("msgreceive", data.message);
    }
  });
});

