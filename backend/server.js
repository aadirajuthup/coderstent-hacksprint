const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

app.post('/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        const prompt = `Analyze the following text for misinformation, factual inaccuracies, or misleading statements. If found, provide a brief explanation and categorize the type of misinformation:\n\n${text}`;

        const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant that identifies misinformation." },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);

    } catch (error) {
        console.error("Error analyzing text:", error);
        if (error.response) {
            console.error(error.response.data);
        }
        res.status(500).json({ error: "Failed to analyze text." });
    }
});

app.listen(port, () => {
    console.log(`Backend server listening on port ${port}`);
});