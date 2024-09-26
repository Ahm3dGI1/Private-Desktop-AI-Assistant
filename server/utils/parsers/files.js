const fs = require("fs");
const path = require("path");

exports.fileCmdHandler = async (task) => {
    console.log(`Handling file command: ${task}`);
    
    if (task.includes("##[file-create]")) {
        const fileNameParts = task.replace("##[file-create]", "").trim().split(" ");
        const fileName = fileNameParts.join("_"); // Join multiple words with underscores if necessary

        const filePath = path.join(__dirname, "../../../sandbox");
        const fullFilePath = path.join(filePath, fileName);
        
        try {
            // Create the directory if it doesn't exist
            fs.mkdirSync(filePath, { recursive: true });
            // Create the file
            fs.writeFileSync(fullFilePath, ""); // Creates an empty file
            console.log(`File created at ${fullFilePath}`);
        } catch (error) {
            console.error(`Error creating file: ${error.message}`);
        }
    }

}

// const createFile = async (details) => {
//     console.log(`Creating file: ${details}`);
// }

// const deleteFile = async (details) => {
//     console.log(`Deleting file: ${details}`);
// }

// const renameFile = async (details) => {
//     console.log(`Renaming file: ${details}`);
// }