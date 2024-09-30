const { authorize, listEvents, addEvent } = require("../googleCalendar/calendarUtility.js");


const client = authorize();

/**
 * Handles different Calendar commands.
 * Accepted commands include: 
 * - `##[calendar-list]`: Lists all events on the calendar.
 * - `##[calendar-add]`: Adds a test event to the calendar.
 * 
 * @param {Array} task - The task to be executed.
 */
exports.calendarCmdHandler = async (task) => {
    console.log(`Handling calendar command: ${task}`);
    
    if (task.includes("##[calendar-list]")) {
        listEvents(client);
    }

    if (task.includes("##[calendar-add]")) {
        const eventDetails = {
            summary: "Test Event",
            location: "Test Location",
            description: "Test Description",
            startDateTime: "2021-08-01T12:00:00-07:00",
            endDateTime: "2021-08-01T13:00:00-07:00"
        };
        addEvent(client, eventDetails);
    }
};

