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
    return ['No messages found.'];
  }

  const messagesSnippets = await Promise.all(messages.map(async (message) => {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    return msg.data.snippet;
  }));

  return messagesSnippets;
}

async function sendMessage(auth, message) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: message,
    },
  });

  return res;
}

module.exports = {
  listLabels,
  listMessages,
};
