const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

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
                aiResponse, systemResponse = await ollamaService.generateCompletion(messages);
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

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});