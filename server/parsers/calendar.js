const { authorize } = require('../services/googleapi/auth.js');
const { listEvents, addEvent } = require('../utils/calendarUtils.js');


/**
 * Lists the next events on the user's primary calendar.
 * 
 * @param {number} taskParams - The number of events to list.
 * @returns {string} - The list of upcoming events in Markdown format.
 */
async function calendarListEvents(taskParams = 10) {
    try{
        // Authorize the client
        const client = await authorize();

        let result = "";

        // Handle listing events
        const events = await listEvents(client);

        if (!events || events.length === 0) {
            return "### Upcoming Events\n\n- No upcoming events found in your calendar.";
        }

        // Format the event list
        result = [
            "### Upcoming Calendar Events",
            ...events.map((event, index) => `- **${index + 1}.** ${event}`),
        ].join("\n");

        return result;

    }catch(error){
        console.error(`Error handling calendar command: ${error.message}`);
        return `### Error\n\n- An error occurred while handling the calendar command: ${error.message}`;
    }
}

/**
 * Adds an event to the user's primary calendar.
 * 
 * @param {Object} taskParams - The parameters for adding an event.
 * @param {string} taskParams.title - The title of the event.
 * @param {string} taskParams.startTime - The start time of the event.
 * @param {string} taskParams.endTime - The end time of the event.
 * @returns {string} - The result of the command execution in Markdown format.
 */
async function calendarCreateEvents(taskParams) {
    try{
        // Authorize the client
        const client = await authorize();

        // Validate required parameters
        const eventTitle = taskParams.title;
        const eventStartTime = taskParams.startTime;
        const eventEndTime = taskParams.endTime;
        if (!eventTitle || !startTime || !endTime) {
            return "### Error\n\n- Missing required parameters for adding an event. Ensure `eventTitle`, `eventStartTime`, and `eventEndTime` are provided.";
        }

        const eventDetails = {
            eventTitle,
            eventStartTime,
            eventEndTime,
        };

        await addEvent(client, eventDetails);
        return `### Event Added Successfully\n\n- Event **"${eventTitle}"** has been added to your calendar.`;

    }catch(error){
        console.error(`Error handling calendar command: ${error.message}`);
        return `### Error\n\n- An error occurred while handling the calendar command: ${error.message}`;
    }
}

module.exports = {
    calendarListEvents,
    calendarCreateEvents,
};
