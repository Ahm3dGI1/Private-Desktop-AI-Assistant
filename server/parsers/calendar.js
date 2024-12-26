const { authorize } = require("../services/googleapi/auth.js");
const { listEvents, addEvent } = require("../utils/calendarUtils.js");

/**
 * Handles different Calendar commands.
 * Accepted commands include: 
 * - `##[calendar-list]`: Lists all events on the calendar.
 * - `##[calendar-add]`: Adds a test event to the calendar.
 * 
 * @param {string} task - The task to be executed.
 * @returns {string} - The result of the command.
 */
exports.calendarCmdHandler = async (taskName, taskParams) => {
    try {
        // Authorize the client first
        const client = await authorize();
        let result = "";

        // Events listing
        if (taskName === "calendar-list") {
            const events = await listEvents(client);
            result += "Upcoming Calendar Events:\n";
            result += events.join("\n");
        }

        // Event addition
        if (taskName === "calendar-add") {
            const eventDetails = {
                "title" : taskParams.title,
                "startTime" : taskParams.startTime,
                "endTime" : taskParams.endTime
            };

            await addEvent(client, eventDetails);
            result = "Event added to the calendar successfully.";
        }
        
        return result;
    } catch (error) {
        console.error(`Error handling calendar command: ${error.message}`);
        return "An error occurred while handling the calendar command.";
    }
};
