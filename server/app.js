const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ollamaService = require('./services/ollama.js');
const { responseHandler } = require("./parsers/responseHandler.js");
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
app.post('/api/ollama', async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Invalid messages format. It must be an array.' });
        }

        // Generate AI response
        const ollamaResponse = await ollamaService.generateCompletion(messages);

        // Handle tasks from AI response
        const taskResultText = await responseHandler(ollamaResponse.tasks);

        // Send text to Python TTS service
        callPythonTTS(`${ollamaResponse.message}\n${taskResultText}`);

        const aiResponse = ollamaResponse.message;
        const systemResponse = taskResultText;

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