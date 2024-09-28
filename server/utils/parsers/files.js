const fs = require("fs");
const path = require("path");

exports.fileCmdHandler = async (task) => {
    console.log(`Handling file command: ${task}`);
    
    if (task.includes("##[file-create]")) {
        const fileNameParts = task.replace("##[file-create]", "").trim().split(" ");
        const fileName = fileNameParts.join("_");
        const filePath = path.join(__dirname, "../../../sandbox");

        fileCreate(filePath, fileName);
    }
}

const fileCreate = (filePath, fileName) => {
    const fullFilePath = path.join(filePath, fileName);

    try {
        fs.mkdirSync(filePath, { recursive: true });
        fs.writeFileSync(fullFilePath, "");
        console.log(`File created at ${fullFilePath}`);

    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
    }
};