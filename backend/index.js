const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { Server } = require("socket.io");
const Job = require("./models/Job");
const { json } = require("express");
const ACTIONS = require("./Actions");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");



app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://localhost/compilerapp")
  .then(() => console.log("Connected to mongoDB!"));

const server = http.createServer(app);
const io = new Server(server);


const userSocketMap = {};


function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        userkaname: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("Socket Connected", socket.id);

  socket.on(ACTIONS.JOIN, ({ idOfRoom, nameToSend }) => {
    console.log("function call");
    const roomId = idOfRoom;
    const userkaname = nameToSend;
    userSocketMap[socket.id] = userkaname;
    socket.join(roomId);

    const clients = getAllConnectedClients(roomId);
    console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        userkaname,
        socketId: socket.id,
      });
    });

  });

  socket.on(ACTIONS.CODE_CHANGE, ({ idOfRoom, code, username }) =>{
    const codeSent = code;
    const idSent = idOfRoom;
    const userSent = username;
    // io.to(idOfRoom).emit(ACTIONS.CODE_CHANGE, {codeSent});
    // io.in(idOfRoom).emit(ACTIONS.CODE_CHANGE, { codeSent });
    // socket.in(idOfRoom).emit(ACTIONS.CODE_CHANGE, {codeSent});
    socket.in(idOfRoom).emit(ACTIONS.CODE_CHANGE, { codeSent, idSent, userSent});

  })
  socket.on(ACTIONS.SYNC_CODE, ({  code, socketId }) =>{
    const codeSent = code;

    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { codeSent });

  })


  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        userkaname: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});


app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("Status requested", jobId);
  if (jobId === undefined)
    return res
      .status(400)
      .json({ success: false, error: "Missing id query param" });

  try {
    const job = await Job.findById(jobId);

    if (job === undefined)
      return res.status(400).json({ success: false, error: "Invalid job id" });

    return res.status(200).json({ success: true, job });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, error: JSON.stringify(error) });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;
  // console.log(language, code.length)
  if (code === undefined)
    res
      .status(400)
      .json({ success: false, error: "The code body cannot be empty" }); // bad request if there is no code

  let job;
  try {
    // we need to generate a cpp file with content from request
    const filepath = await generateFile(language, code);
    // we need to run the file and then send the response

    job = await new Job({ language, filepath });
    const jobId = job["_id"];
    console.log(job);
    res.status(201).json({ success: true, jobId });

    let output;

    job["startedAt"] = new Date();
    if (language === "cpp") {
      output = await executeCpp(filepath);
    } else {
      output = await executePy(filepath);
    }

    job["completedAt"] = new Date();
    job["status"] = "Success";
    job["output"] = output;

    await job.save();
    console.log(job);
    // return res.json({ filepath, output });
  } catch (error) {
    job["completedAt"] = new Date();
    job["status"] = "Error";
    job["output"] = JSON.stringify(error);
    await job.save();
    console.log(job);
    // res.status(500).json({ error });
  }
});

server.listen(5000, () => {
  console.log("Listening on port 5000");
});
