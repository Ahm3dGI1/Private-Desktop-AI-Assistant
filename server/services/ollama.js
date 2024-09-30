const { responseHandler } = require("../utils/responseHandler.js");

/** `generateCompletion` Generates a completion using the Ollama Chat Generator API.
 * @param {Array} messages - An array of all the previous messages and new ones to send to the API.
*/
exports.generateCompletion = async (messages) => {
    try {
        // Send a POST request to the Ollama Chat Generator API
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                "model": "dolphin-mistral:7b-v2.8",
                "messages": messages,
                "format": "json",
                "stream": false,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
 
        const json = await response.json();
        const jsonResponse = JSON.parse(json.message.content, null, 2);
    

        // Handle the response
        responseHandler(jsonResponse.tasks);

        // Return the message to be displayed
        return jsonResponse.message;

    } catch (error) {
        console.error('Error generating AI response:', error);
        updateMessage("An error occurred while generating the AI response.");
    }
};