const {authorize} = require('../services/googleapi/auth.js');
const {listConnectionNames} = require('../utils/contactsUtils.js');


/**
 * A parser that handles the contacts commands.
 * Accepted tasks include:
 *  - `##[contacts-list]`: Lists the contacts in the user's Google account.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the task.
 */
async function contactsCmdHandler(task) {
    console.log(`Handling contacts command: ${task}`);
    const client = await authorize();

    // Handle contacts list command
    if (task.startsWith("##[contacts-list]")) {
        try {
            const result = await listConnectionNames(client);
            return result;
        } catch (error) {
            return `Failed to list contacts: ${error.message}`;
        }
    }

    return "Invalid command.";
}

module.exports = {
    contactsCmdHandler,
};