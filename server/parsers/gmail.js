const { listLabels, listMessages, sendMessage } = require('../utils/gmailUtils.js');
const { authorize } = require('../services/googleapi/auth.js');

/**
 * Handles Gmail-related commands with Markdown formatting.
 * 
 * @param {string} taskName - The Gmail command to execute (e.g., "gmail-list", "gmail-messages", "gmail-send").
 * @param {Object} taskParams - The parameters for the Gmail command.
 * @param {number} [taskParams.messagesNo] - Number of messages to retrieve (required for "gmail-messages").
 * @param {string} [taskParams.recipient] - Recipient email address (required for "gmail-send").
 * @param {string} [taskParams.subject] - Email subject (required for "gmail-send").
 * @param {string} [taskParams.message] - Email body (required for "gmail-send").
 * @returns {string} - The result of the Gmail command execution in Markdown format.
 */
async function gmailCMDHandler (taskName, taskParams){
    try {
        // Authorize the client
        const client = await authorize();
        let result = "";

        switch (taskName) {
            case "gmail-list":
                const labels = await listLabels(client);
                result = `### Gmail Labels:\n\n${labels.map(label => `- **${label}**`).join("\n")}`;
                break;

            case "gmail-messages":
                const messages = await listMessages(client, taskParams.messagesNo);
                result = `### Last ${taskParams.messagesNo} Gmail Messages:\n\n${messages}`;
                break;

            case "gmail-send":
                const { recipient, subject, message } = taskParams;
                if (!recipient || !subject || !message) {
                    return 'Error: "recipient", "subject", and "message" parameters are required for the "gmail-send" command.';
                }
                const emailDetails = {
                    from: "ahmedgouda797@gmail.com",
                    to: recipient,
                    subject,
                    message,
                };
                result = await sendMessage(client, emailDetails);
                result = `### Email Sent Successfully:\n\n- **Recipient**: ${recipient}\n- **Subject**: ${subject}\n- **Message**: ${message}`;
                break;
        }

        return result;
    } catch (error) {
        console.error(`Error handling Gmail command: ${taskName}`, error);
        return `### An error occurred:\n\n- **Command**: ${taskName}\n- **Error**: ${error.message}`;
    }
};

module.exports = { gmailCMDHandler };