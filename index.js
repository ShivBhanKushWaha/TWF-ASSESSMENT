const express = require('express');
const bodyParser = require('body-parser');
const translate = require("translate-google");
const langdetect = require('langdetect');

const app = express();
const port = 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

// Function to check if text is in English
const isEnglish = (text) => {
    try {
        const language = langdetect.detectOne(text);
        return language;
    } catch (error) {
        // Handle language detection errors
        console.error('Language detection error:', error);
        return false;
    }
}

// Function to translate English text to French
const translateToFrench = async (englishText) => {
    try {
        // I am using translate-google library to perform the translation
        const translatedText = await translate(englishText, { to: 'fr' });
        return translatedText;
    } catch (error) {
        // Handle translation errors
        throw new Error(`Translation error: ${error.message}`);
    }
}


// POST endpoint for translation requests
app.post('/translate', async (req, res) => {
    try {
        // Check if the 'text' key is present in the request body
        if (req.body && req.body.text) {
            // Get the input text from the request body
            const inputText = req.body.text;

            // Check if the text is in English
            if (isEnglish(inputText) == 'en') {
                // Call the translation function
                const translatedText = await translateToFrench(inputText);

                // send response with the translated text in JSON format
                const response = { translation: translatedText };
                res.json(response);
            } else {
                res.status(400).json({ error: "Input text is not in English" });
            }
        } else {
            // If 'text' key is not present, return a 400 Bad Request response
            res.status(400).json({ error: "Missing 'text' key in the request body" });
        }
    } catch (error) {
        res.status(500).json({ error: String(error) });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
