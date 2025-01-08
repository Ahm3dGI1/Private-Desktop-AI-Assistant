const OpenAI = require("openai");
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

/**
 * `getOpenAiResponse` Fetches a response from the OpenAI API.
 * 
 * @param {Array} messages - An array of all the previous messages and new ones to send to the API.
 * @returns {String} - The response from the OpenAI API.
 */
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function getOpenAiResponse(messages) {
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            store: true,
            messages: messages,
        });
        return completion.data.choices[0].message.content;
    } catch (error) {
        console.error("Error in OpenAI API call:", error);
        return "An error occurred while fetching a response from OpenAI.";
    }
}

module.exports = { getOpenAiResponse };