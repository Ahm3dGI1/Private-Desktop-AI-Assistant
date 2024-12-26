const { authorize } = require("../services/googleapi/auth.js");
const { listEvents, addEvent } = require("../utils/calendarUtils.js");

/**
 * Handles Calendar-related commands.
 * 
 * Accepted tasks:
 * - `calendar-list`: Lists all upcoming events on the user's Google Calendar.
 * - `calendar-add`: Adds a new event to the user's Google Calendar.
 * 
 * @param {string} taskName - The command to execute (e.g., "calendar-list", "calendar-add").
 * @param {Object} taskParams - Additional parameters for the task.
 * @returns {string} - The result of the command.
 */
async function calendarCmdHandler(taskName, taskParams) {
    try {
        // Authorize the client
        const client = await authorize();

        let result = "";

        // Handle listing events
        if (taskName === "calendar-list") {
            const events = await listEvents(client);

            if (!events || events.length === 0) {
                return "No upcoming events found in your calendar.";
            }

            // Format the event list
            result = [
                "Upcoming Calendar Events:",
                ...events.map((event, index) => `${index + 1}. ${event}`),
            ].join("\n");
        }

        // Handle adding an event
        else if (taskName === "calendar-add") {
            // Validate required parameters
            const { title, startTime, endTime } = taskParams;
            if (!title || !startTime || !endTime) {
                return "Missing required parameters for adding an event. Ensure 'title', 'startTime', and 'endTime' are provided.";
            }

            const eventDetails = {
                title,
                startTime,
                endTime,
            };

            await addEvent(client, eventDetails);
            result = `Event "${title}" added to the calendar successfully.`;
        }

        return result;
    } catch (error) {
        console.error(`Error handling calendar command: ${error.message}`);
        return `An error occurred while handling the calendar command: ${error.message}`;
    }
}

module.exports = {
    calendarCmdHandler,
};