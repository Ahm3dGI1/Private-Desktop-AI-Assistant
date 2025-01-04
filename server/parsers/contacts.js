const { authorize } = require('../services/googleapi/auth.js');
const { listConnectionNames } = require('../utils/contactsUtils.js');


/**
 * Lists the user's Google contacts.
 * 
 * @param {Object} taskParams - The parameters for listing contacts.
 * @returns {string} - The list of contacts in Markdown format.
 */
async function contactsList(taskParams = None) {
    // Authorize the client
    const client = await authorize();

    // Fetch contacts
    const contacts = await listConnectionNames(client);

    if (!contacts || contacts.length === 0) {
        return `### Contacts\n\n- No contacts found in your Google account.`;
    }

    // Handle the specific task
    return formatContactList(contacts);
}

/**
 * Formats the list of contacts in Markdown.
 * 
 * @param {Array<string>} contacts - The list of contacts.
 * @returns {string} - Formatted contact list.
 */
function formatContactList(contacts) {
    return [
        "### Your Google Contacts",
        ...contacts.map((contact, index) => `- **${index + 1}.** ${contact}`),
    ].join("\n");
}

/**
 * Searches for a contact by name.
 * 
 * @param {Array<string>} contacts - The list of contacts.
 * @param {string} query - The search query.
 * @returns {string} - Search results in Markdown format.
 */
async function searchContacts(taskParams) {

    // Authorize the client
    const client = await authorize();

    // Fetch contacts
    const contacts = await listConnectionNames(client);

    const query = taskParams.query;

    if (!query.trim()) {
        return `### Error\n\n- Search query cannot be empty.`;
    }

    const matchingContacts = contacts.filter(contact =>
        contact.toLowerCase().includes(query.toLowerCase())
    );

    if (matchingContacts.length > 0) {
        return [
            `### Search Results for "${query}"`,
            ...matchingContacts.map((contact, index) => `- **${index + 1}.** ${contact}`),
        ].join("\n");
    }

    return `### Contact Not Found\n\n- No contacts found matching **"${query}"**.`;
}

module.exports = {
    contactsList,
    searchContacts,
};
