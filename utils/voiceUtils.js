export const startSpeechRecognition = (setInput, language) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Speech recognition is not supported in your browser.");
        return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
        const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
        setInput(transcript);
    };
    recognition.start();
};

export const playTextToSpeech = (text, language) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    synth.speak(utterance);
};
