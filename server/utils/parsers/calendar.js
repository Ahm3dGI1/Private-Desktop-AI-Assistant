const { authorize, listEvents, addEvent } = require("../googleCalendar/calendarUtility.js");


const client = authorize();

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

