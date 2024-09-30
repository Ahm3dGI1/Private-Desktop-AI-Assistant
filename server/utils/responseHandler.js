const { fileCmdHandler } = require("./parsers/files.js")
const { calendarCmdHandler } = require("./parsers/calendar.js")

/**
 * A parser that takes the AI response and handles the tasks accordingly.
 * Accepted tasks include:
 *  - File commands
 *      - `##[file-create]`: Creates a file in the sandbox directory.
 *  - Calendar commands
 *      - `##[calendar-list]`: Lists all events on the calendar.
 *      - `##[calendar-add]`: Adds a test event to the calendar.
 * 
 * @param {Array} tasksList - The list of tasks to be executed.
 */
exports.responseHandler = async (tasksList) => {

    for (let task of tasksList) {
        if (task.includes("##[file-create]")){
            console.log(`Handling file command: ${task}`);
            fileCmdHandler(task);
        }

        if (task.includes("##[calendar-list]") || task.includes("##[calendar-add]")){
            console.log(`Handling calendar command: ${task}`);
            calendarCmdHandler(task);
        }
    }
    return;
};