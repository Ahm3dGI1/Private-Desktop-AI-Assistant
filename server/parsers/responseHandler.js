const { fileCmdHandler } = require("./files.js");
const { calendarCmdHandler } = require("./calendar.js");
const { gmailCmdHandler } = require("./gmail.js");
const { contactsCmdHandler } = require("./contacts.js");
const { githubCmdHandler } = require("./github.js");
const { newsCMDHandler } = require("./news.js");

/**
 * A parser that takes the AI response and handles the tasks accordingly.
 * Accepted tasks include:
 *  - File commands
 *      - `##[file-create]`: Creates a file in the sandbox directory.
 *  - Calendar commands
 *      - `##[calendar-list]`: Lists all events on the calendar.
 *      - `##[calendar-add]`: Adds a test event to the calendar.
 *  - Gmail commands
 *      - `##[gmail-list]`: Lists all labels in the Gmail account.
 *      - `##[gmail-messages] <MessagesNo>`: Lists the last `MessagesNo` emails in the Gmail account.
 *      - `##[gmail-send]` <recipient> <subject> <message> : Sends an email to the recipient with the subject and message.
 * 
 * @param {Array<string>} tasksList - The list of tasks to be executed.
 * @returns {string} - The result of all the tasks concatenated into one response string.
 */
exports.responseHandler = async (tasksList) => {
    let taskResultText = "";

    console.log("tasksList: ", tasksList);

    for (let task of tasksList) {
        try {
            // Handle file commands
            if (task.startsWith("##[file-create]")) {
                taskResultText += await fileCmdHandler(task) + "\n";
            }

            // Handle calendar commands
            else if (task.startsWith("##[calendar-list]") || task.startsWith("##[calendar-add]")) {
                taskResultText += await calendarCmdHandler(task) + "\n";
            }

            // Handle Gmail commands
            else if (task.startsWith("##[gmail-list]") || task.startsWith("##[gmail-messages]") || task.startsWith("##[gmail-send]")) {
                taskResultText += await gmailCmdHandler(task) + "\n";
            }

            // Handle contacts commands
            else if (task.startsWith("##[contacts-list]")) {
                taskResultText += await contactsCmdHandler(task) + "\n";
            }

            // Handle Github commands
            else if (task.startsWith("##[github-list-repos]") || task.startsWith("##[github-create-repo]")) {
                taskResultText += await githubCmdHandler(task) + "\n";
            }

            // Handle News commands
            else if (task.startsWith("##[news-list]")) {
                taskResultText += await newsCMDHandler(task) + "\n";
            }

            // If the task doesn't match any known command
            else {
                console.warn(`Unrecognized task: ${task}`);
                taskResultText += `Unrecognized task: ${task}\n`;
            }
        } catch (error) {
            console.error(`Error processing task: ${task}, Error: ${error.message}`);
            taskResultText += `Error processing task: ${task}\n`;
        }
    }

    return taskResultText.trim();
};
