

import OpenAI from "openai";

const translateButton = document.querySelector('.translate-button');
const startOverButton = document.querySelector('.start-over-button');


translateButton.addEventListener('click', () => {
    generateTranslation(getInputText(), getSelectedLanguage());
    renderTranslationOutput();
});

startOverButton.addEventListener('click', () => {

    renderTranslationInput();
});

function getInputText() {
    return document.querySelector('#translation-input textarea').value;
}

function getSelectedLanguage() {
    return document.querySelector('input[name="language"]:checked').value;
}

function getMessages(inputText, selectedLanguage) { 
    return [
            {
                role: "system",
                content: `You are tasked with translating text from English to ${selectedLanguage}.`
            },
            {
                role: "user",
                content: inputText
            }
    ];
}

async function generateTranslation(inputText, selectedLanguage) {
    try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
        const openai = new OpenAI({
            apiKey: apiKey,
            dangerouslyAllowBrowser: true
        });

        const generation = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: getMessages(inputText, selectedLanguage),
            temperature: 1,
            max_tokens: 200
        });

        const translation = generation.choices[0].message.content;
        renderTranslationOutput(translation);
    } catch (error) {
        console.log(error);
    }
    
}

function renderTranslationInput() {
    // Display the input layout
    document.getElementById('translation-input').style.display = 'block';
    document.getElementById('translation-result').style.display = 'none';
}

function renderTranslationOutput(translation) {
    // Display the output layout
    const originalText = document.querySelector('.original-text textarea');
    const translatedText = document.querySelector('.translated-text textarea');
    originalText.value = getInputText()
    translatedText.value = translation;
    document.getElementById('translation-input').style.display = 'none';
    document.getElementById('translation-result').style.display = 'block';
}