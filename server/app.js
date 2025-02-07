const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const ollamaService = require('./services/ollama.js');
const openaiService = require('./services/openAi.js');
const { callPythonTTS } = require("./services/pythonMicroservice.js");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


/**
 * Route to handle AI message processing
 */
app.post('/api/model', async (req, res) => {
    try {
        const { messages, model } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format. It must be an array.' });
        }

        if (!model) {
            return res.status(400).json({ error: 'Model not provided.' });
        }

        let aiResponse;
        let systemResponse = "";

        // Call the appropriate service based on the model
        switch (model.toLowerCase()) {
            case 'ollama':
                const ollamaResponse = await ollamaService.generateCompletion(messages);
                aiResponse = ollamaResponse.aimessage;
                systemResponse = ollamaResponse.systemMessage;
                break;

            case 'openai':
                aiResponse = await openaiService.getOpenAiResponse(messages);
                break;

            default:
                return res.status(400).json({ error: `Unsupported model: ${model}` });
        }

        console.log('AI response:', aiResponse);

        // Send text to Python TTS service
        callPythonTTS(`${aiResponse}\n${systemResponse}`);

        // Return AI and system responses
        return res.json({ aiResponse, systemResponse });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return res.status(500).json({ error: 'Failed to generate AI response.' });
    }
});

/** Conversations API */
async function getStoredConversations() {
    try {
        const data = fs.readFile(path.join(__dirname, 'data', 'conversations.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('No conversations stored:', error);
        return {};
    }
}

/**
 * Route to get stored conversations
 */
app.get("/api/conversations", async(req, res) => {
    const conversations = await getStoredConversations();
    return res.json(conversations);
});

/**
 * Route to save a new message to a conversation
 */
app.post("/api/conversations/save", async(req, res) => {
    try{
        const {conversationId, messages} = req.body;
        if (!conversationId || !messages) {
            return res.status(400).json({ error: 'Invalid request. Conversation ID and messages are required.' });
        }

        const conversations = await getStoredConversations();
        conversations[conversationId] = messages;

        await fs.writeFile(path.join(__dirname, 'data', 'conversations.json'), JSON.stringify(conversations, null, 2));
        return res.json({ message: "Conversation saved successfully." });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to save conversation.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});