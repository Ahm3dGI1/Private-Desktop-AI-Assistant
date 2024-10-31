const { google } = require('googleapis');

/**
 * Print the display name if available for 10 connections.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listConnectionNames(auth) {
  const service = google.people({version: 'v1', auth});
  const res = await service.people.connections.list({
    resourceName: 'people/me',
    pageSize: 10,
    personFields: 'names,emailAddresses',
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log('No connections found.');
    return;
  }
  console.log('Connections:');
  connections.forEach((person) => {
    if (person.names && person.names.length > 0) {
      console.log(person.names[0].displayName);
    } else {
      console.log('No display name found for connection.');
    }
  });
}

module.exports = {
  listConnectionNames,
};