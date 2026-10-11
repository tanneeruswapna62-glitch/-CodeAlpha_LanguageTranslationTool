const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLanguage = document.getElementById("sourceLanguage");
const targetLanguage = document.getElementById("targetLanguage");
const translateButton = document.getElementById("translateButton");
const copyButton = document.getElementById("copyButton");
const status = document.getElementById("status");

translateButton.addEventListener("click", async function () {
    const text = inputText.value.trim();

    if (text === "") {
        status.textContent = "Please enter text to translate.";
        return;
    }

    if (sourceLanguage.value === targetLanguage.value) {
        status.textContent = "Please select two different languages.";
        return;
    }

    translateButton.disabled = true;
    translateButton.textContent = "Translating...";
    status.textContent = "";
    outputText.value = "";

    try {
        const url = "https://api.mymemory.translated.net/get?q="
            + encodeURIComponent(text)
            + "&langpair="
            + sourceLanguage.value
            + "|"
            + targetLanguage.value;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Translation service is unavailable.");
        }

        const data = await response.json();

        if (data.responseStatus !== 200) {
            throw new Error("Unable to translate. Please try again.");
        }

        outputText.value = data.responseData.translatedText;
        status.textContent = "Translation completed successfully!";

    } catch (error) {
        status.textContent =
            "Translation failed. Check your internet connection and try again.";
        console.error(error);

    } finally {
        translateButton.disabled = false;
        translateButton.textContent = "Translate";
    }
});

copyButton.addEventListener("click", async function () {
    const text = outputText.value.trim();

    if (text === "") {
        status.textContent = "There is no translation to copy.";
        return;
    }

    try {
        await navigator.clipboard.writeText(text);
        status.textContent = "Translation copied!";
    } catch (error) {
        outputText.focus();
        outputText.select();
        status.textContent = "Select the text and copy it using Ctrl+C.";
    }
});