const { listLabels, listMessages } = require('../googleGmail/gmailUtility.js');
const { authorize } = require('../../services/googleapi/auth.js');

/**
 * Handles different Gmail commands.
 * Accepted commands include:
 * - `##[gmail-list]`: Lists all labels in the Gmail account.
 * - `##[gmail-messages] <MessagesNo> `: Lists the last `MessagesNo` emails in the Gmail account.
 * 
 * @param {string} task - The task to be executed.
 */
exports.gmailCmdHandler = async (task) => {
    try {
        console.log(`Handling Gmail command: ${task}`);

        // Authorize the client first
        const client = await authorize();

        // Handle Gmail labels listing
        if (task.startsWith("##[gmail-list]")) {
            await listLabels(client);
        }

        // Handle Gmail messages listing
        if (task.startsWith("##[gmail-messages]")) {
            const messagesNo = parseInt(task.replace("##[gmail-messages]", "").trim()) || 10;
            await listMessages(client, messagesNo);
        }
    } catch (error) {
        console.error(`Error handling Gmail command: ${error.message}`);
    }
};
