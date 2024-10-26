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
exports.calendarCmdHandler = async (task) => {
    try {
        console.log(`Handling calendar command: ${task}`);

        // Authorize the client first
        const client = await authorize();
        let result = "";

        // Handle Calendar events listing
        if (task.startsWith("##[calendar-list]")) {
            const events = await listEvents(client);
            result += "Upcoming Calendar Events:\n";
            result += events.join("\n");

            return result;
        }

        // Handle Calendar event addition
        if (task.startsWith("##[calendar-add]")) {
            const eventDetails = {
                summary: "Test Event",
                location: "Test Location",
                description: "Test Description",
                startDateTime: "2021-08-01T12:00:00-07:00",
                endDateTime: "2021-08-01T13:00:00-07:00"
            };

            await addEvent(client, eventDetails);
            return "Event added to the calendar successfully.";
        }

        return "Invalid command.";
    } catch (error) {
        console.error(`Error handling calendar command: ${error.message}`);
        return "An error occurred while handling the calendar command.";
    }
};
