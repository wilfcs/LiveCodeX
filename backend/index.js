const express = require ("express");
const app = express();

app.use(express.urlencoded({ extended:true }));
app.use(express.json());


app.get("/", ( req, res )=>{
return res.json({hello: "world!"})
})

app.post("/run", (req, res)=>{
    console.log(req.body)
    return res.json(req.body);
})

app.listen(5000, ()=>{
    console.log("Listening on port 5000");
})
