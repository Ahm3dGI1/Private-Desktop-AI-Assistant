const { responseHandler } = require("../utils/responseHandler.js");

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
                
        // Handle the response
        responseHandler(json.message.content.tasks);

        return json.message.content.message;

    } catch (error) {
        console.error('Error generating AI response:', error);
        updateMessage("An error occurred while generating the AI response.");
    }
};