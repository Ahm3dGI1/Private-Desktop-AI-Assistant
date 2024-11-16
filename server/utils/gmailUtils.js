const { google } = require('googleapis');

/**
 * Lists the labels in the user's Gmail account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Array|string} - List of label names or an error message.
 */
async function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.labels.list({
    userId: 'me',
  });

  const labels = res.data.labels || [];
  if (labels.length === 0) {
    return ['No labels found.'];
  }


  return labels.map(label => label.name);
}

/**
 * Lists the last 'maxResults' emails in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {number} maxResults The maximum number of messages to return.
 * @returns {Array|string} - List of email snippets or an error message.
 */
async function listMessages(auth, maxResults = 10) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    labelIds: ['INBOX'],
  });

  const messages = res.data.messages || [];
  if (messages.length === 0) {
    return 'No messages found.';
  }

  // Fetch detailed information for each message
  const messageSummaries = await Promise.all(messages.map(async (message) => {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });

    // Extract relevant details
    const headers = msg.data.payload.headers;
    const sender = headers.find(header => header.name === 'From')?.value || 'Unknown Sender';
    const subject = headers.find(header => header.name === 'Subject')?.value || 'No Subject';

    return {
      sender,
      subject,
    };
  }));

  return formatEmailSummaries(messageSummaries);
}

/**
 * Formats email summaries into a user-friendly string or JSON response.
 *
 * @param {Array<Object>} emailSummaries - List of email summaries.
 * @returns {string} - Formatted email summaries for display or return.
 */
function formatEmailSummaries(emailSummaries) {
  if (emailSummaries === 'No messages found.') {
    return emailSummaries;
  }

  return emailSummaries.map((email, index) => (
    `${index + 1}. Sender: ${email.sender}\n   Subject: ${email.subject}`
  )).join('\n\n');
}

/**
 * Creates a Base64-encoded raw email message.
 * @param {Object} emailDetails The details of the email (to, from, subject, body).
 * @returns {string} Base64-encoded email string.
 */
function createRawEmail(emailDetails) {
  
  const email = [
    `From: ${emailDetails.from}`,
    `To: ${emailDetails.to}`,
    `Subject: ${emailDetails.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset="UTF-8"',
    '',
    emailDetails.body,
  ].join('\n');

  const base64EncodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return base64EncodedEmail;

}

/**
 * Send an email using Gmail API.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Object} emailDetails The details of the email (to, from, subject, body).
 * @returns {string} Confirmation of email being sent or error message.
 */
async function sendMessage(auth, message) {
  const gmail = google.gmail({ version: 'v1', auth });

  try{

    const email = createRawEmail(message);

    const res = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: email,
      },
    });

    return `Email ${res.data.id} sent successfully`;
  } catch (error) {
    return `Error sending email: ${error}`;
  }
}

module.exports = {
  listLabels,
  listMessages,
  sendMessage,
};
