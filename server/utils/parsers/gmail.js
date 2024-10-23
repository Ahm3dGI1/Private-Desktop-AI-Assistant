const { listLabels, listMessages } = require('../googleGmail/gmailUtility.js');
const { authorize } = require('../../services/googleapi/auth.js');

/**
 * Handles different Gmail commands.
 * Accepted commands include:
 * - `##[gmail-list]`: Lists all labels in the Gmail account.
 * - `##[gmail-messages] <MessagesNo> `: Lists the last `MessagesNo` emails in the Gmail account.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command.
 */
exports.gmailCmdHandler = async (task) => {
    try {
        console.log(`Handling Gmail command: ${task}`);

        // Authorize the client first
        const client = await authorize();

        let result = "";

        // Handle Gmail labels listing
        if (task.startsWith("##[gmail-list]")) {
            const labels = await listLabels(client);
            result += "Gmail Labels:\n";
            result += labels.join("\n");

            return result;
        }

        // Handle Gmail messages listing
        if (task.startsWith("##[gmail-messages]")) {
            const messagesNo = parseInt(task.replace("##[gmail-messages]", "").trim()) || 10;
            result += `Last ${messagesNo} Gmail Messages:\n`;
            const messages = await listMessages(client, messagesNo);
            result += messages.join("\n");

            return result;
        }

        return "Invalid command.";

    } catch (error) {
        console.error(`Error handling Gmail command: ${error.message}`);
        return "An error occurred while handling the Gmail command.";
    }
};
