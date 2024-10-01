const say = require('say');

const speak = (text) => {
    say.speak(text, "Microsoft Zira Desktop", 1.3);
};

module.exports = {
    speak,
};

