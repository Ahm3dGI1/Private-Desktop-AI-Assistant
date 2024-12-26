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
async function responseHandler(tasksList){
    if (!tasksList || tasksList.length === 0) {
        return "";
    }

    const tasksDict = {
        "file-edit": fileCmdHandler,
        "file-create": fileCmdHandler,
        "calendar-list": calendarCmdHandler,
        "calendar-add": calendarCmdHandler,
        "gmail-list": gmailCmdHandler,
        "gmail-messages": gmailCmdHandler,
        "gmail-send": gmailCmdHandler,
        "contacts-list": contactsCmdHandler,
        "github-list-repos": githubCmdHandler,
        "github-create-repo": githubCmdHandler,
        "news-list": newsCMDHandler
    }
    
    let taskResultText = "";

    for (let task of tasksList) {
        const taskName = task.command
        const taskParams = task.parameters
        const taskHandler = tasksDict[taskName]
        
        try {
            taskResultText += await taskHandler(taskName, taskParams) + "\n";
        }catch (error) {
            console.error(`Error executing task: ${taskName}`, error);
            taskResultText += `Failed to execute task: ${taskName}\n`;
        }
    }

    return taskResultText.trim();
};

module.exports = {
    responseHandler
};