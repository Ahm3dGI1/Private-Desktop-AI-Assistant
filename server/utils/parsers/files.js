const fs = require("fs");
const path = require("path");


/**
 * Handles different file commands.
 * Accepted commands include:
 * - `##[file-create]`: Creates a file in the sandbox directory.
 * 
 * @param {Array} task - The task to be executed.
 */

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
 * Creates a file at the specified path with the given name.
 * If the directory does not exist, it will be created.
 *
 * @param {string} filePath - The path of the directory where the file will be created.
 * @param {string} fileName - The name of the file to be created.
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