const { google } = require('googleapis');

/**
 * Formats a date string into a human-readable format.
 * @param {string} dateTimeString - The date string to format.
 * @returns {string} - Formatted date.
 */
function formatDate(dateTimeString) {
  const date = new Date(dateTimeString);

  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @returns {Array<string>} - List of upcoming events or an error message.
 */
async function listEvents(auth) {
  const calendar = google.calendar({ version: 'v3', auth });
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });

  const events = res.data.items || [];
  if (events.length === 0) {
    return ['No upcoming events found.'];
  }

  // Use formatted dates for event listing
  return events.map((event) => {
    let start = event.start.dateTime || event.start.date;
    return `${formatDate(start)} - ${event.summary}`;
  });
}

/**
 * Adds an event to the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Object} eventDetails The details of the event to add.
 * @returns {string} - Confirmation of event creation or error message.
 */
async function addEvent(auth, eventDetails) {
  const calendar = google.calendar({ version: 'v3', auth });
  const event = {
    summary: eventDetails.summary || 'No Title',
    location: eventDetails.location || '',
    description: eventDetails.description || '',
    start: {
      dateTime: eventDetails.startDateTime || '',
      timeZone: 'America/Los_Angeles',
    },
    end: {
      dateTime: eventDetails.endDateTime || '',
      timeZone: 'America/Los_Angeles',
    },
  };

  try {
    const res = await calendar.events.insert({
      auth: auth,
      calendarId: 'primary',
      resource: event,
    });
    return `Event created: ${res.data.htmlLink}`;
  } catch (err) {
    console.error('Error adding event to calendar:', err);
    return 'Failed to create the event on the calendar.';
  }
}


module.exports = {
  listEvents,
  addEvent,
};
