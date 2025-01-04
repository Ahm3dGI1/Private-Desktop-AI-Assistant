import OpenAI from "openai";
require('dotenv').config({ path: path.join(__dirname, '../.env') });


const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

async function getOpenAiResponse(messages) {
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
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