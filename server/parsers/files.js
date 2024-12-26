const fs = require("fs").promises;
const path = require("path");

/**
 * Handles different file commands.
 * Accepted commands include:
 * - `##[file-create]`: Creates a file in the sandbox directory.
 * 
 * @param {Object} taskParams - The parameters for the file command.
 * @param {string} taskParams.fileName - The name of the file to be created or edited.
 * @param {string|string[]} taskParams.fileContent - The content to be written to the file.
 * @returns {string} - The result of the command execution.
 */
async function fileCmdHandler(taskName, taskParams) {
    const filePath = path.join(__dirname, "../../sandbox");

    const fileName = taskParams.fileName;
    let fileContent = taskParams.fileContent;
    
    if (Array.isArray(fileContent)) {
        fileContent = fileContent.join("\n"); // Convert array back to string with newline separators
    }

    try {
        const fullFilePath = path.join(filePath, fileName);
        // Ensure the directory exists
        await fs.mkdir(filePath, { recursive: true });
        // Write content to the file
        await fs.writeFile(fullFilePath, fileContent);

        return `File "${fileName}" ${fileContent ? "edited" : "created"} successfully.`;
    } catch (error) {
        return `Failed to handle file operation: ${error.message}`;
    }
}

module.exports = { fileCmdHandler };