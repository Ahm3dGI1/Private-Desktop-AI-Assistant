const fs = require("fs").promises;
const path = require("path");

/**
 * Handles different file commands.
 * Accepted commands include:
 * - `##[file-create]`: Creates a file in the sandbox directory.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command execution.
 */
async function fileCmdHandler (task){
    console.log(`Handling file command: ${task}`);

    const filePath = path.join(__dirname, "../../sandbox");

    // Use regex to match quoted strings in the command
    const regex = /'([^']+)'/g;
    const matches = [...task.matchAll(regex)].map(match => match[1]);

    // Get file name and optional content
    const fileName = matches[0];
    const fileContent = matches[1] || "untitled.txt"; // Default to empty content

    // Handle file editing and creation
    if (task.startsWith("##[file-edit]") || task.startsWith("##[file-create]")) {
        try {
            const result = await fileEdit(filePath, fileName, fileContent);
            console.log(`Editing file: ${filePath, fileName}`);

            return result;
        } catch (error) {
            return `Failed to ${fileContent ? "edit" : "create"} file: ${error.message}`;
        }
    }

    return "Invalid command.";
};

/**
 * Edits a file at the specified path with the given name.
 * If the directory does not exist, it will be created.
 * If the file does not exist, it will be created.
 * 
 * @param {string} filePath - The path of the directory where the file will be edited.
 * @param {string} fileName - The name of the file to be edited.
 * @param {string} fileContent - The content to be written to the file.
 * @returns {string} - Confirmation message for the file editing or creation.
 */
const fileEdit = async (filePath, fileName, fileContent = "") => {
    const fullFilePath = path.join(filePath, fileName);
    try {
        // Ensure the directory exists
        await fs.mkdir(filePath, { recursive: true });

        // Write content to the file
        await fs.writeFile(fullFilePath, fileContent);

        return `File "${fileName}" ${fileContent ? "edited" : "created"} successfully`;
    } catch (error) {
        throw new Error(`Error editing file: ${error.message}`);
    }
};

module.exports = { fileCmdHandler };