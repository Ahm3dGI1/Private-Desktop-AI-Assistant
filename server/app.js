const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ollamaService = require('./services/ollama.js');
const { responseHandler } = require("./utils/responseHandler.js");
const { callPythonTTS } = require("./services/tts.js");

const app = express();
const PORT = process.env.PORT;

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

        const ollamaResponse = await ollamaService.generateCompletion(messages);

            // Handle the response tasks
            const taskResultText = await responseHandler(ollamaResponse.tasks);

            // Return the message to be spoken
            
            const aiResponse = ollamaResponse.message + '\n' + taskResultText;
            const sysResponse = taskResultText;

            callPythonTTS(aiResponse);

        return res.json({ aiResponse, sysResponse });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
