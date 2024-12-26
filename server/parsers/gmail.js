const { listLabels, listMessages, sendMessage } = require('../utils/gmailUtils.js');
const { authorize } = require('../services/googleapi/auth.js');

/**
 * Handles different Gmail commands.
 * Accepted commands include:
 * - `##[gmail-list]`: Lists all labels in the Gmail account.
 * - `##[gmail-messages] <MessagesNo> `: Lists the last `MessagesNo` emails in the Gmail account.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command.
 */
exports.gmailCmdHandler = async (taskName, taskParams) => {
    try {
        // Authorize the client first
        const client = await authorize();

        let result = "";

        // Handle Gmail labels listing
        if (taskName === "gmail-list") {
            const labels = await listLabels(client);
            result += "Gmail Labels:\n";
            result += labels.join("\n");
        }

        // Handle Gmail messages listing
        if (taskName === "gmail-messages") {
            const messagesNo = taskParams.messagesNo;
            result += `Last ${messagesNo} Gmail Messages:\n`;
            const messages = await listMessages(client, messagesNo);
            result += messages.join("\n");
        }

        // Handle Gmail send email
        if (taskName === "gmail-send") {
            const emailDetails = {
                from: "ahmedgouda797@gmail.com",
                to: taskParams.recipient,
                subject: taskParams.subject,
                message: taskParams.message,
            };
            
            result = await sendMessage(client, emailDetails);
        }

        return result;
    } catch (error) {
        console.error(`Error handling Gmail command: ${error.message}`);
        return "An error occurred while handling the Gmail command.";
    }
};