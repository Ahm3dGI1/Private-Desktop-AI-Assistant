const { listMessages, sendMessage } = require('../utils/gmailUtils.js');
const { authorize } = require('../services/googleapi/auth.js');


/**
 * Lists the last emails from the user's Gmail account.
 * 
 * @param {Object} taskParams - The parameters for the task.
 * @param {number} taskParams.messagesNo - The number of messages to list.
 * @returns {string} - The list of the last emails.
 */
async function gmailListEmails(taskParams){
    try {
        const client = await authorize();
        const messages = await listMessages(client, taskParams.messagesNo);
        return `### Last ${taskParams.messagesNo} Gmail Messages:\n\n${messages}`;
    } catch (error) {
        console.error(`Error listing Gmail messages`, error);
        return `### An error occurred:\n\n- **Error**: ${error.message}`;
    }
}

/**
 * Sends an email to a recipient.
 * 
 * @param {Object} taskParams - The parameters for the task.
 * @param {string} taskParams.recipient - The email address of the recipient.
 * @param {string} taskParams.subject - The subject of the email.
 * @param {string} taskParams.message - The message body of the email.
 * @returns {string} - The status of the email sending operation.
 */
async function gmailSendEmail(taskParams){
    try {
        const client = await authorize();

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
        await sendMessage(client, emailDetails);
        return `### Email Sent Successfully:\n\n- **Recipient**: ${recipient}\n- **Subject**: ${subject}\n- **Message**: ${message}`;
    } catch (error) {
        console.error(`Error sending Gmail message`, error);
        return `### An error occurred:\n\n- **Error**: ${error.message}`;
    }
}

module.exports = { gmailListEmails, gmailSendEmail };