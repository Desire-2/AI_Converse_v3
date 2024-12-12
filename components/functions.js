import axios from 'axios';
export const handleLanguageChange = async (selectedLanguage, input, setInput, setLanguage) => {
    if (!selectedLanguage) {
        console.error("No language selected.");
        return;
    }
    setLanguage(selectedLanguage);

    // Notify the user about the language change
    console.log(`Language changed to: ${selectedLanguage}`);

    // Optionally: Translate the current input to the selected language
    if (input) {
        try {
            const translatedText = await translateInput(input, selectedLanguage);
            setInput(translatedText);
        } catch (err) {
            console.error("Error translating input:", err);
        }
    }
};

export const handleAISuggestions = async (input, language, setInput) => {
    try {
        const aiResponse = await fetch("https://api.example.com/ai-suggestions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ input, language }),
        });

        if (!aiResponse.ok) {
            throw new Error("Failed to fetch AI suggestions.");
        }

        const { suggestions } = await aiResponse.json();

        if (suggestions && suggestions.length > 0) {
            setInput((prevInput) => `${prevInput}\n\nSuggestions:\n${suggestions.join("\n")}`);
            console.log("AI suggestions added:", suggestions);
        } else {
            console.log("No suggestions available.");
        }
    } catch (error) {
        console.error("Error fetching AI suggestions:", error);
    }
};



export const handleFileUpload = async (file, setMessages) => {
    if (!file) {
        console.error("No file selected.");
        return;
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
        console.error("Unsupported file type.");
        alert("Please upload a valid file (PNG, JPEG, or PDF).");
        return;
    }

    console.log(`Uploading file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch('/api/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        const { caption, summary, responseText } = response.data;

        // Construct a message depending on the response
        let fileMessage = `Uploaded file: **${file.name}**`;
        if (caption) {
            fileMessage += `\n\n**Image Caption:** ${caption}`;
        } else if (summary) {
            fileMessage += `\n\n**Document Summary:**\n${summary}`;
        } else if (responseText) {
            fileMessage += `\n\n**Audio/Text Analysis:**\n${responseText}`;
        } else {
            fileMessage += `\n\n**Processing Result:** No specific output returned.`;
        }

        if (typeof setMessages === 'function') {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: fileMessage, type: "system" },
            ]);
        } else {
            console.error("setMessages is not a valid function.");
        }

        console.log("File processed successfully:", fileMessage);
    } catch (error) {
        console.error("Error uploading or processing file:", error);
        if (typeof setMessages === 'function') {
            setMessages((prevMessages) => [
                ...prevMessages,
                { text: `Error processing file: ${error.message}`, type: "error" },
            ]);
        }
    }
};
