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

/**
 * The function `fileCreate` creates a file at a specified path with a given name in JavaScript.
 * @param filePath - Refers to the directory path where you want to create the file. This is the 
 * location where the new file will be saved.
 * @param fileName - The name of the file that will be created.
 */
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