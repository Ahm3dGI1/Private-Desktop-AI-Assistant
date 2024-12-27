const fs = require("fs").promises;
const path = require("path");

/**
 * Handles different file commands.
 * Accepted commands include:
 * - `[file-create]`: Creates or edits a file in the sandbox directory.
 * 
 * @param {string} taskName - The command type (e.g., "file-create", "file-edit").
 * @param {Object} taskParams - The parameters for the file command.
 * @param {string} taskParams[fname] - The name of the file to be created or edited.
 * @param {string|string[]} taskParams[content] - The content to be written to the file (optional for empty files).
 * @returns {string} - The result of the command execution in Markdown format.
 */
async function fileCMDHandler(taskName, taskParams) {
    const filePath = path.join(__dirname, "../../sandbox");
    const fileName = taskParams.fname || "untitled.txt";
    let fileContent = taskParams.content || "";

    if (Array.isArray(fileContent)) {
        fileContent = fileContent.join("\n"); // Convert array to string with newline separators
    }

    try {
        const fullFilePath = path.join(filePath, fileName);
        // Ensure the directory exists
        await fs.mkdir(filePath, { recursive: true });

        // Write content to the file
        await fs.writeFile(fullFilePath, fileContent);

        const operation = taskName === "file-create" ? "created" : "edited";
        return `### File Operation Success\n\n- **File**: \`${fileName}\`\n- **Operation**: ${operation} successfully.\n- **Directory**: \`${filePath}\``;
    } catch (error) {
        console.error(`Error handling file command: ${taskName}`, error);
        return `### Error\n\n- **File**: \`${fileName}\`\n- **Reason**: ${error.message}`;
    }
}

module.exports = { fileCMDHandler };