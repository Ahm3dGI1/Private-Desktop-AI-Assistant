import {responseHandler} from "../utils/parsers/responseHandler.js"

export const generateCompletion = async (messages, updateMessage) => {
    // Send a POST request to Ollama Chat Generator API
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        body: JSON.stringify({
            "model": "llama3.1",
            "messages": messages,
            "stream": false,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    
    const json = await response.json();
    responseHandler(json.message.content);
    updateMessage(json.message.content);
}


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