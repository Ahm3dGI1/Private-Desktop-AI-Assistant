const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const ollamaService = require('./services/ollama.js');
const ttsService = require('./services/tts.js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/ollama', async (req, res) => {
    const { messages } = req.body;

    try {
        const aiResponse = await ollamaService.generateCompletion(messages);
        res.json(aiResponse);
    } catch (error) {
        console.error('Error generating AI response:', error);
        res.status(500).json({ error: 'Failed to generate AI response' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
