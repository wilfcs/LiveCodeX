const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const { executePy } = require("./executePy");
const Job = require("./models/Job");
const { json } = require("express");

// mongoose.connect("mongodb://localhost/compilerapp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// }, (err) => {
//   if(err){
//     console.log(err);
//     process.exit(1);
//   }
//   else{
//     console.log("Sucessfully connected to mongoDb database")
//   }
// })

mongoose
  .connect("mongodb://localhost/compilerapp")
  .then(() => console.log("Connected to mongoDB!"));

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.get("/status", async (req, res) => {
  const jobId = req.query.id;
  console.log("Status requested", jobId);
  if(jobId === undefined)
    return res.status(400).json({success: false, error: "Missing id query param"});

  try {
    const job = await Job.findById(jobId);

    if(job === undefined)
      return res.status(400).json({success: false, error: "Invalid job id"});

    return res.status(200).json({success: true, job});
  } catch (error) {
    return res.status(400).json({success: false, error: JSON.stringify(error)})
  }
})

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
    res.status(201).json({success: true,jobId});
    
    
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
    console.log(job)
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

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
