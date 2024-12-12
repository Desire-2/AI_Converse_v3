import { useState, useEffect } from "react";
import ChatArea from "../components/ChatArea";
import InputArea from "../components/InputArea";
import Sidebar from "../components/Sidebar";
import ThemeToggle from "../components/ThemeToggle";
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from "../utils/localStorageUtils";


const AIConverse = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [selectedPrompt, setSelectedPrompt] = useState("");
    const [theme, setTheme] = useState("light");
    const [language, setLanguage] = useState("en-US");
    const [customPrompts, setCustomPrompts] = useState([]);
    const [showPrompts, setShowPrompts] = useState(true);
    const [conversationHistory, setConversationHistory] = useState([]);
    const [pinnedChats, setPinnedChats] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [activePromptIndex, setActivePromptIndex] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    
const CONSTANT_PROMPTS = [
    "Explain JavaScript closures.",
    "How does React handle state?",
    "What is the difference between REST and GraphQL?",
    "Give me tips on optimizing web performance.",
    "Explain the concept of microservices.",
    "Discuss the importance of biodiversity in ecosystem stability.",
    "What are the main threats to biodiversity?",
    "How can we mitigate the effects of climate change on wildlife?",
    "Explain the role of genetic diversity in conservation.",
    "What are the benefits of protected areas for conservation?",
    "How do invasive species impact native ecosystems?",
    "What is the significance of the Endangered Species Act?",
    "Describe the process of habitat restoration.",
    "How does deforestation affect global biodiversity?",
    "What are the key principles of sustainable development?",
    "Explain the concept of ecosystem services.",
    "What are the challenges in marine conservation?",
    "How can citizen science contribute to conservation efforts?",
    "Discuss the role of zoos and aquariums in conservation.",
    "What are the ethical considerations in wildlife conservation?",
    "Explain the importance of pollinators in ecosystems.",
    "How does urbanization impact wildlife?",
    "What are the methods for monitoring wildlife populations?",
    "Describe the impact of plastic pollution on marine life.",
    "What are the strategies for conserving endangered species?",
    "How does climate change affect coral reefs?",
    "What is the role of environmental education in conservation?",
    "Explain the concept of rewilding.",
    "What are the benefits of biodiversity hotspots?",
    "How can technology be used in conservation efforts?"
];
    // Fetch prompts and history from localStorage on component mount
    useEffect(() => {
        const prompts = getFromLocalStorage("prompts") || [];
        const history = getFromLocalStorage("history") || [];
        setCustomPrompts(prompts);
        setConversationHistory(history);
    }, []);

    // Save conversation history to localStorage whenever it updates
    useEffect(() => {
        saveToLocalStorage("history", conversationHistory);
    }, [conversationHistory]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActivePromptIndex((prevIndex) => (prevIndex + 1) % CONSTANT_PROMPTS.length);
        }, 3000); // Change prompt every 3 seconds
    
        return () => clearInterval(interval); // Clean up the interval on component unmount
    }, []);

    // Handle prompt click
    const handlePromptClick = (prompt) => {
        setInput(prompt);
        setShowPrompts(false); // Hide prompts once clicked
    };

    // Handle theme toggling
    const handleThemeToggle = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

    // Delete entire conversation history
    const deleteHistory = () => {
        setConversationHistory([]);
        removeFromLocalStorage("history");
    };
    
       // Function to pin a chat by name
        const handlePinChat = (chatName) => {
            const chatToPin = conversationHistory.find((chat) => chat.name === chatName);
            if (chatToPin && !pinnedChats.some((chat) => chat.name === chatToPin.name)) {
                setPinnedChats((prev) => [...prev, chatToPin]);
            }
        };

    // Function to export conversation history
    const handleExportHistory = () => {
        const exportData = JSON.stringify(conversationHistory, null, 2);
        const blob = new Blob([exportData], { type: "application/json" });
        const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "chat.json";
            link.click();
    };

    // Function to view group chats
    const handleViewGroupChats = () => {
        alert("Group Chats feature is coming soon!");
    };

    // Function to create a new group chat
    const handleCreateGroupChat = () => {
        const groupName = prompt("Enter a name for the new group:");
        if (groupName) {
            setGroupChats((prev) => [
                ...prev,
                {
                    name: groupName,
                    messages: [],
                },
            ]);
            alert(`Group "${groupName}" created successfully!`);
        }
    };

    // Function to delete group chat
    const handleDeleteGroupChat = (groupIndex) => {
        const updatedGroups = groupChats.filter((_, index) => index !== groupIndex);
        setGroupChats(updatedGroups);
    };

    // Function to unpin a chat
    const handleUnpinChat = (chatIndex) => {
        setPinnedChats((prev) => prev.filter((_, index) => index !== chatIndex));
    };


    // Rename a specific chat
    const handleRenameChat = (index) => {
        const newName = prompt("Enter a new chat name:");
        if (newName) {
            setConversationHistory((prev) => {
                const updatedHistory = [...prev];
                updatedHistory[index].name = newName;
                return updatedHistory;
            });
        }
    };

    // Delete a specific chat
    const handleDeleteChat = (index) => {
        setConversationHistory((prev) => prev.filter((_, i) => i !== index));
    };

        // Handle sending a message
    const handleSendMessage = async () => {
        if (!input) return;
    
        const userMessage = {
            role: "user",
            content: `${selectedPrompt} ${input}`,
            timestamp: new Date().toLocaleTimeString(),
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput("");
    
        setIsTyping(true); // Show typing indicator
    
        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input, language }),
            });
    
            const data = await response.json();
            const botMessage = {
                role: "bot",
                content: data.reply,
                timestamp: new Date().toLocaleTimeString(),
            };
            setMessages((prev) => [...prev, botMessage]);
    
            const mainIdea = input.split(" ").slice(0, 5).join(" ");
            const chatName = mainIdea || "New Chat";
    
            setConversationHistory((prev) => [
                ...prev,
                { name: chatName, messages: [...newMessages, botMessage] },
            ]);
        } catch (error) {
            console.error("Error fetching bot reply:", error);
        } finally {
            setIsTyping(false); // Hide typing indicator
        }
    };
    
    let isRecording = false;
    let recognition;
    
    const handleVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in your browser.");
            return;
        }
    
        recognition = new SpeechRecognition();
        recognition.lang = language;
    
        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join("");
            setInput(transcript);
        };
    
        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
        };
    
        recognition.start();
        isRecording = true;
        updateRecordingIcon();
    };
    
    const handleStopRecording = () => {
        if (recognition) {
            recognition.stop();
            isRecording = false;
            updateRecordingIcon();
        }
    };
    
    const handleRecordingIconClick = () => {
        if (isRecording) {
            handleStopRecording();
        } else {
            handleVoiceInput();
        }
    };
    
    const updateRecordingIcon = () => {
        const recordingIcon = document.getElementById('recording-icon');
        if (isRecording) {
            recordingIcon.style.color = 'red';
        } else {
            recordingIcon.style.color = 'black';
        }
    };
    
    
    

    // Handle voice output (text-to-speech)
    const handleVoiceOutput = (text) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    };

    

    return (
        <div 
            className={`app-container theme-${theme}`}
                style={{ display: "flex",
                height: "100vh",
                backgroundColor: theme === "light" ? "#f9f9f9" : "#1a1a1a",
             }}
                >
            {/* Sidebar Component */}
            <div
                className="sidebar-container"
                style={{
                    width: "370px", // Adjust width as needed
                    height: "100%",
                    backgroundColor: theme === "light" ? "#ffffff" : "#2a2a2a",
                    borderRight: theme === "light" ? "1px solid #e0e0e0" : "1px solid #444",
                    overflowY: "auto",
                }}
            >
            <Sidebar
                theme={theme}
                handleThemeToggle={handleThemeToggle}
                conversationHistory={conversationHistory}
                setMessages={setMessages}
                deleteHistory={() => setConversationHistory([])}
                handleRenameChat={handleRenameChat}
                handleDeleteChat={handleDeleteChat}
                handleExportHistory={handleExportHistory}
                pinnedChats={pinnedChats} // Add this
                handlePinChat={handlePinChat} // Add this
                groupChats={groupChats} // Add this
                handleViewGroupChats={handleViewGroupChats} // Add this
                handleCreateGroupChat={handleCreateGroupChat} // Add this
                handleDeleteGroupChat={handleDeleteGroupChat} // Add this
                handleUnpinChat={handleUnpinChat} // Add this
                
            />
            </div>
            


            {/* Main Chat Area */}
            <div 
                className="main-chat"
                    style={{
                        flex: 1, // Takes up the remaining space
                        position: "relative",
                        padding: "10px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                    }}
                
                >
                {/* Welcome Message & Prompts */}
                {showPrompts && (
                    <div
                        className="welcome-prompts"
                        style={{
                            padding: "20px",
                            borderRadius: "12px",
                            backgroundColor: theme === "light" ? "#f0f9ff" : "#1e293b",
                            color: theme === "light" ? "#0f172a" : "#e2e8f0",
                            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                            textAlign: "center",
                            margin: "10px auto",
                            maxWidth: "90%",
                            position: "relative", // Make the container relative
                            height: "300px", // Set a height for the container
                            overflow: "hidden", // Ensure content doesn't overflow
                        }}
                    >
                        <div style={{ marginBottom: "20px" }}>
                            <h1
                                style={{
                                    fontSize: "2rem",
                                    color: theme === "light" ? "#2563eb" : "#93c5fd",
                                    fontWeight: "bold",
                                    margin: "0",
                                }}
                            >
                                Welcome to Ai Converse! 🤖
                            </h1>
                            <p
                                style={{
                                    margin: "10px 0 0",
                                    fontSize: "1.2rem",
                                    fontWeight: "400",
                                    color: theme === "light" ? "#334155" : "#cbd5e1",
                                }}
                            >
                                Your AI-powered coding assistant is here to help. Select a prompt to get started:
                            </p>
                        </div>

                        {/* Sliding Prompts */}
                        <div
                            className="sliding-prompts"
                            style={{
                                display: "flex",
                                position: "absolute", // Position the slider absolutely
                                bottom: "5px", // Place it 10px from the bottom
                                left: 0,
                                right: 0,
                                justifyContent: "center", // Center the slider horizontally
                                width: "100%",
                            }}
                        >
                            <div
                                className="prompt-slider"
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    transition: "transform 0.5s ease-out",
                                    transform: `translateX(-${activePromptIndex * 100}%)`,
                                }}
                            >
                                {CONSTANT_PROMPTS.map((prompt, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            minWidth: "100%",
                                            textAlign: "center",
                                            padding: "10px",
                                        }}
                                    >
                                        <button
                                            onClick={() => handlePromptClick(prompt)}
                                            style={{
                                                background: theme === "light"
                                                    ? "linear-gradient(45deg, #3b82f6, #2563eb)"
                                                    : "linear-gradient(45deg, #4f46e5, #9333ea)",
                                                color: "#fff",
                                                padding: "12px 16px",
                                                borderRadius: "8px",
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                                border: "none",
                                                cursor: "pointer",
                                                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                                boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.transform = "scale(1.05)";
                                                e.target.style.boxShadow = "0 10px 25px rgba(0, 0, 0, 0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.transform = "scale(1)";
                                                e.target.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
                                            }}
                                        >
                                            <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                <span style={{ fontSize: "1.5rem" }}>✨</span>
                                                {prompt}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

    
    


                <ChatArea messages={messages} theme={theme} />
                <InputArea
                    input={input}
                    setInput={setInput}
                    handleSendMessage={handleSendMessage}
                    handleVoiceInput={handleVoiceInput}
                    handleRecordingIconClick={handleRecordingIconClick}
                    handleVoiceOutput={() => handleVoiceOutput(messages[messages.length - 1]?.content || "No message")}
                    isRecording={isRecording}
                />
            </div>
        </div>
    );
};

export default AIConverse;
