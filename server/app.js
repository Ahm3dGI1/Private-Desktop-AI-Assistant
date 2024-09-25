const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ollamaService = require('./services/ollama.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/ollama', async (req, res) => {
    const { messages } = req.body.messages;
    const {updateMessage} = req.body.updateMessage;

    try {
        const aiResponse = await ollamaService.generateCompletion(messages, updateMessage);
        res.json(aiResponse);
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

app.post('/api/tasks', async (req, res) => {
    const { aiMessage } = req.body;

    try {
        const tasks = parseTasks(aiMessage);
        
        for (let task of tasks) {
            if (task.type === 'file-create') {
                await fileCmdHandler(task);
            }
        }

        res.json({ status: 'Tasks executed successfully' });
    } catch (error) {
        console.error('Error executing tasks:', error);
        res.status(500).json({ error: 'Failed to execute tasks' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
