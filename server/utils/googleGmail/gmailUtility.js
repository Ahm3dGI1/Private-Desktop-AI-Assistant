const { auth } = require("googleapis/build/src/apis/abusiveexperiencereport/index.js");
const { authorize } = require("../../services/googleapi/auth.js");
const {google} = require('googleapis');

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listLabels(auth) {
  const gmail = google.gmail({version: 'v1', auth});
  const res = await gmail.users.labels.list({
    userId: 'me',
  });
  const labels = res.data.labels;
  if (!labels || labels.length === 0) {
    console.log('No labels found.');
    return;
  }
  console.log('Labels:');
  labels.forEach((label) => {
    console.log(`- ${label.name}`);
  });
}

/**
 * Lists the last 10 emails in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listMessages(auth, maxResults = 10) {
  const gmail = google.gmail({ version: 'v1', auth });
  const res = await gmail.users.messages.list({
    userId: 'me',
    maxResults: maxResults,
    labelIds: ['INBOX'],
  });
  const messages = res.data.messages || [];
  if (messages.length === 0) {
    return "No messages found.";
  }

  let messagesSnippets = [];

  for (const message of messages) {
    const msg = await gmail.users.messages.get({
      userId: 'me',
      id: message.id,
    });
    messagesSnippets = [...messagesSnippets, msg.data.snippet];
  }

  return messagesSnippets;
}


module.exports = {
  listLabels,
  listMessages,
};