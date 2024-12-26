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
async function contactsCmdHandler(taskName, taskParams) {
    const client = await authorize();

    try {
        const result = await listConnectionNames(client);
        return result;
    } catch (error) {
        return `Failed to list contacts: ${error.message}`;
    }

}

module.exports = {
    contactsCmdHandler,
};