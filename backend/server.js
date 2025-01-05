const express = require('express');
const cors = require('cors');
const OpenAI = require('openai'); // Import the openai package
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Define the categories (tags) - you can keep this as is
const CATEGORIES = {
    "misinformation": "Content that is factually incorrect or misleading.",
    "spam": "Unsolicited, irrelevant, or promotional content.",
    "harassment": "Content that is abusive, threatening, or hateful.",
    "adult": "Sexually explicit or suggestive content.",
    "violence": "Content that depicts or promotes violence or harm.",
    "other": "Content that doesn't fit into the above categories but is still potentially problematic."
};

app.post('/analyze', async (req, res) => {
    try {
        const { text, apiKey, baseUrl, modelName } = req.body;

        // Initialize OpenAI with the user-provided key and base URL
        const openai = new OpenAI({
            apiKey: apiKey,
            baseURL: baseUrl
        });

        // Construct the prompt for the LLM (adapted for Gemini)
        const prompt = `
            Analyze the following text and classify it into one or more of the following categories: 
            ${JSON.stringify(CATEGORIES)}

            Provide a confidence score (0.0 - 1.0) for each category.

            Return the analysis in JSON format:
            {
                "categories": {
                    "misinformation": {
                        "confidence": 0.0,
                        "explanation": "Explanation or null"
                    },
                    // ... other categories
                }
            }

            Text: ${text}
        `;

        // Call the Gemini API using openai.chat.completions.create
        const response = await openai.chat.completions.create({
            model: modelName,
            messages: [
                { role: "system", content: "You are a helpful assistant that identifies misinformation and classifies content into predefined categories. You ONLY respond in valid JSON." },
                { role: "user", content: prompt }
            ]
        });

        console.log("LLM Response:", response.choices[0].message);

        // Parse the JSON response (with error handling)
        let parsedResponse;
        try {
            parsedResponse = response.choices[0].message;
            // parsedResponse = JSON.parse(llmResponse); // No need to parse here it should already be an object
        } catch (error) {
            console.error("Error parsing LLM response as JSON:", error);
            return res.status(500).json({ error: "Failed to parse LLM response." });
        }

        // Validate the parsed response structure (optional but recommended)
        if (!parsedResponse.content) {
            return res.status(500).json({ error: "Invalid LLM response format." });
        }

        const jsonString = parsedResponse.content
        const responseObject = {};
        let currentKey = null;
        let currentValue = "";
        let insideQuotes = false;

        for (let i = 0; i < jsonString.length; i++) {
            const char = jsonString[i];

            if (char === '"') {
                insideQuotes = !insideQuotes;
                if (!insideQuotes && currentKey !== null) {
                    responseObject[currentKey] = currentValue.trim();
                    currentKey = null;
                    currentValue = "";
                }
            } else if (char === ':' && !insideQuotes) {
                currentKey = currentValue.trim();
                currentValue = "";
            } else if ((char === ',' || char === '}') && !insideQuotes) {
                if (currentKey !== null) {
                    responseObject[currentKey] = currentValue.trim();
                }
                currentKey = null;
                currentValue = "";
            } else if (insideQuotes) {
                currentValue += char;
            }
        }

        if (currentKey !== null) {
            responseObject[currentKey] = currentValue.trim();
        }

        const categories = {};
        for (const key in responseObject) {
            if (responseObject.hasOwnProperty(key)) {
              const value = responseObject[key];
              const category = {};
          
              if (!isNaN(parseFloat(value))) {
                category.confidence = parseFloat(value);
                category.explanation = null;
              } else {
                category.confidence = null;
                category.explanation = value;
              }
          
              categories[key] = category;
            }
        }

        const formattedResponse = {
            categories: categories
        };
        
        // Send the parsed JSON response
        res.json(formattedResponse);

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