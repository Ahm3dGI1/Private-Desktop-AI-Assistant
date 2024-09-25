const { responseHandler } = require("../utils/parsers/responseHandler.js");

exports.generateCompletion = async (messages) => {
    try {
        // Send a POST request to the Ollama Chat Generator API
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "model": "llama3.1",   // Specify the model here
                "messages": messages,  // The array of message objects sent from frontend
                "stream": false        // Set stream to false for non-streaming requests
            }),
        });

        // If the response is not OK, throw an error
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the JSON response
        const json = await response.json();

        return json.message.content;

    } catch (error) {
        console.error('Error generating AI response:', error);
        updateMessage("An error occurred while generating the AI response.");
    }
};



// Trial 1
// export const generateCompletion = async (messages, updateMessage) => {

//     // Send a POST request to Ollama Chat Generator API
//     const response = await fetch('http://localhost:11434/api/chat', {
//         method: 'POST',
//         body: JSON.stringify({
//             "model": "llama3.1",
//             "messages": messages,
//             "stream": true,
//         }),
//     });

//     if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     // Since the response is a JSON stream, I used the ReadableStream API to read it
//     const reader = response.body.getReader();
//     const decoder = new TextDecoder();
//     let content = '';

//     while (true) {
//         const { done, value } = await reader.read();

//         // The last json in the stream will have done as true
//         if (done) {
//             break;
//         }

//         // Decode the chunk of data if it is not done
//         const rawJson = decoder.decode(value);
//         try {
//             const json = JSON.parse(rawJson);
//             if (json.done === false) {
//                 updateMessage(json.message.content);
//             }
//         } catch (e) {
//             console.error('Failed to parse JSON:', rawJson);
//         }
//     }
// };