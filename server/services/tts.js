const axios = require('axios');

async function callPythonTTS(text) {
    try {
        const response = await axios.post('http://localhost:4001/speak', { text });
        console.log(response.data.message);
    } catch (error) {
        console.error("Error calling Python microservice:", error.message);
    }
}

module.exports = { callPythonTTS };
