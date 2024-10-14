import { authorize } from '../googleapi/auth';

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listEvents(auth) {
  const calendar = google.calendar({version: 'v3', auth});
  const res = await calendar.events.list({
    calendarId: 'primary',
    timeMin: new Date().toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  });
  const events = res.data.items;
  if (!events || events.length === 0) {
    console.log('No upcoming events found.');
    return;
  }
  console.log('Upcoming 10 events:');
  events.map((event, i) => {
    const start = event.start.dateTime || event.start.date;
    console.log(`${start} - ${event.summary}`);
  });
}

/**
 * Adds an event to the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 * @param {Object} eventDetails The details of the event to add.
 */
async function addEvent(auth, eventDetails) {
  const event = {
    'summary': eventDetails.summary || 'No Title',
    'location': eventDetails.location || '',
    'description': eventDetails.description || '',
    'start': {
      'dateTime': eventDetails.startDateTime || '',
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': eventDetails.endDateTime || '',
      'timeZone': 'America/Los_Angeles',
    }
  };
  
  calendar.events.insert({
    auth: auth,
    calendarId: 'primary',
    resource: event,
  }, function(err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink); 
  });
}

module.exports = {
  authorize,
  listEvents,
  addEvent,
};