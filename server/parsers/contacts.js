const { authorize } = require('../services/googleapi/auth.js');
const { listConnectionNames } = require('../utils/contactsUtils.js');

/**
 * Handles contact-related commands.
 * 
 * Accepted tasks:
 * - `contacts-list`: Lists the contacts in the user's Google account.
 * 
 * @param {string} taskName - The command to execute (e.g., "contacts-list").
 * @param {Object} taskParams - Additional parameters for the task (not used currently, but kept for extensibility).
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

        // Format the contacts list in Markdown
        const result = [
            "### Your Google Contacts",
            ...contacts.map((contact, index) => `- **${index + 1}.** ${contact}`),
        ].join("\n");

        return result;
    } catch (error) {
        console.error(`Error in contactsCMDHandler for command "${taskName}":`, error);
        return `### Error\n\n- Failed to list contacts: ${error.message}`;
    }
}

module.exports = {
    contactsCMDHandler,
};
