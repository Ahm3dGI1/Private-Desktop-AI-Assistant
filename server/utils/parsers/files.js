const fs = require("fs").promises; // Use fs.promises for async handling
const path = require("path");

/**
 * Handles different file commands.
 * Accepted commands include:
 * - `##[file-create]`: Creates a file in the sandbox directory.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command execution.
 */
exports.fileCmdHandler = async (task) => {
    console.log(`Handling file command: ${task}`);
    
    if (task.startsWith("##[file-create]")) {
        const fileNameParts = task.replace("##[file-create]", "").trim().split(" ");
        const fileName = fileNameParts.join("_");
        const filePath = path.join(__dirname, "../../../sandbox");

        try {
            const result = await fileCreate(filePath, fileName);
            return result;
        } catch (error) {
            console.error(`Error in fileCmdHandler: ${error.message}`);
            return `Failed to create file: ${error.message}`;
        }
    }

    return "Invalid command.";
};

/**
 * Creates a file at the specified path with the given name.
 * If the directory does not exist, it will be created.
 *
 * @param {string} filePath - The path of the directory where the file will be created.
 * @param {string} fileName - The name of the file to be created.
 * @returns {string} - Confirmation message for the file creation.
 */
const fileCreate = async (filePath, fileName) => {
    const fullFilePath = path.join(filePath, fileName);

    try {
        await fs.mkdir(filePath, { recursive: true }); // Create directory if it doesn't exist
        await fs.writeFile(fullFilePath, ""); // Create an empty file
        console.log(`File created at ${fullFilePath}`);
        return `File created at ${fullFilePath}`;
    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
        throw new Error(`Error creating file: ${error.message}`);
    }
};
