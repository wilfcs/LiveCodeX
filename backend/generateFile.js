const { constants } = require("buffer")
const fs = require("fs")
const path = require("path")
const {v4: uuid} = require("uuid") // renaming v4 as uuid for simplicity

const dirCode = path.join(__dirname, "codes")

if(!fs.existsSync(dirCode)){
    fs.mkdirSync(dirCode, {recursive:true})
} // if there is no "codes" folder then create one

const generateFile = async (format, code)=>{
    const jobId = uuid();
    const filename = `${jobId}.${format}`
    const filepath = path.join(dirCode, filename)
    await fs.writeFileSync(filepath, code)
    return filepath;
}

module.exports = {
    generateFile,
};