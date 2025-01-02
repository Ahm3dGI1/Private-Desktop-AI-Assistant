const { authorize } = require('../services/googleapi/auth.js');
const { listConnectionNames } = require('../utils/contactsUtils.js');

/**
 * Handles contact-related commands.
 * 
 * Accepted tasks:
 * - `contacts-list`: Lists the contacts in the user's Google account.
 * - `contacts-search`: Searches for a specific contact by name.
 * 
 * @param {string} taskName - The command to execute (e.g., "contacts-list", "contacts-search").
 * @param {Object} taskParams - Parameters for the task (used for `contacts-search`).
 * @returns {string} - The result of the task in Markdown format.
 */
async function contactsCMDHandler(taskName, taskParams) {
    try {
        // Authorize the client
        const client = await authorize();

        // Fetch contacts
        const contacts = await listConnectionNames(client);

        if (!contacts || contacts.length === 0) {
            return `### Contacts\n\n- No contacts found in your Google account.`;
        }

        // Handle the specific task
        if (taskName === "contacts-list") {
            return formatContactList(contacts);
        } else if (taskName === "contacts-search") {
            return searchContacts(contacts, taskParams?.query || "");
        } else {
            return `### Error\n\n- Unknown command: **${taskName}**.`;
        }
    } catch (error) {
        console.error(`Error in contactsCMDHandler for command "${taskName}":`, error);
        return `### Error\n\n- Failed to execute command "${taskName}": ${error.message}`;
    }
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
function searchContacts(contacts, query) {
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
    contactsCMDHandler,
};
