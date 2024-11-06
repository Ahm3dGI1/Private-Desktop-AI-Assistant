const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ollamaService = require('./services/ollama.js');
const { responseHandler } = require("./parsers/responseHandler.js");
const { callPythonTTS } = require("./services/pythonMicroservice.js");

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

        const { curr_task, task_queue, message: aiResponse } = ollamaResponse;

        const taskResultText = await responseHandler(curr_task);

        const sysResponse = task_queue.length === 0 ? taskResultText : null;
        const userReprompt = task_queue.length > 0 ? taskResultText : null;

        callPythonTTS(aiResponse).catch(console.error);

        return res.json({
            aiResponse,
            sysResponse,
            userReprompt,
            taskQueue: task_queue,
            currTask: curr_task
        });
        
    } catch (error) {
        console.error('Error generating AI response:', error);
        return res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});