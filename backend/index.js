const express = require ("express");
const {generateFile} = require("./generateFile")
const {executeCpp} = require("./executeCpp")
const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());


app.get("/", ( req, res )=>{
return res.json({hello: "world!"})
})

app.post("/run", async (req, res)=>{
    const {language = "cpp", code} = req.body;
    if(code === undefined) res.status(400).json({success: false, error: "The code body cannot be empty"}); // bad request if there is no code

    // we need to generate a cpp file with content from request
    const filepath = await generateFile(language, code)
    // we need to run the file and then send the response
    const output = await executeCpp(filepath);

    return res.json({ filepath, output });
})


app.listen(5000, ()=>{
    console.log("Listening on port 5000");
})
