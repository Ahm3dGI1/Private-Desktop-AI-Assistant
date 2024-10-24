const { listLabels, listMessages, sendMessage } = require('../googleGmail/gmailUtility.js');
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

        // Handle Gmail send email
        if (task.startsWith("##[gmail-send]")) {
            // Regex pattern to capture the parameters of the command since they can be more than one word and are wrapped in single quotes
            const regex = /'([^']+)'/g;
            const matches = [...task.matchAll(regex)].map(match => match[1]);
        
            if (matches.length === 3) {
                const emailDetails = {
                    from: "ahmedgouda797@gmail.com",
                    to: matches[0],
                    subject: matches[1],
                    message: matches[2], 
                };
                
                result = await sendMessage(client, emailDetails);

                return result;
            }
        }
        
        return "Invalid command.";

    } catch (error) {
        console.error(`Error handling Gmail command: ${error.message}`);
        return "An error occurred while handling the Gmail command.";
    }
};
