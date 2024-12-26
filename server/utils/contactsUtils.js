const { google } = require('googleapis');

/**
 * Fetches the names and email addresses of up to 10 connections from the user's Google account.
 *
 * @param {google.auth.OAuth2} auth - An authorized OAuth2 client.
 * @returns {Array<string>} - A list of contact names and emails, or an empty array if no connections are found.
 */
async function listConnectionNames(auth) {
    try {
        const service = google.people({ version: 'v1', auth });
        const res = await service.people.connections.list({
            resourceName: 'people/me',
            pageSize: 10,
            personFields: 'names,emailAddresses',
        });

        const connections = res.data.connections || [];

        if (connections.length === 0) {
            return [];
        }

        // Format contacts as "Name (Email)" or just "Name" if email is unavailable
        return connections.map((person) => {
            const name = person.names?.[0]?.displayName || "No Name";
            const email = person.emailAddresses?.[0]?.value || "No Email";
            return `${name} (${email})`;
        });
    } catch (error) {
        console.error("Error fetching connections:", error);
        throw new Error("Unable to fetch Google Contacts.");
    }
}

module.exports = {
    listConnectionNames,
};
