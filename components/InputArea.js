import React, { useEffect, useRef } from "react";
import { Form, Button, Tooltip, OverlayTrigger } from "react-bootstrap";
import { FaMicrophone, FaPaperclip, FaPaperPlane, FaLightbulb, FaPlay, FaUpload } from "react-icons/fa";
import { handleLanguageChange, handleAISuggestions, handleFileUpload } from "./functions";


const InputArea = ({ input, setInput, handleSendMessage, handleVoiceInput, handleVoiceOutput, handleRecordingIconClick, language, setLanguage, setMessages, isRecording }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 250)}px`;
        }
    }, [input]);

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            setInput(input + "\n");
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        handleLanguageChange(selectedLanguage, input, setInput, setLanguage);
    };

    const handleAIRequest = () => {
        handleAISuggestions(input, language, setInput);
    };

    const handleFileSelection = async (event) => {
        const file = event.target.files[0];
        if (file) {
            await handleFileUpload(file, setMessages);
        }
    };

    return (
        <div
            className="input-container d-flex align-items-center flex-wrap"
            style={{
                position: "relative",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "30px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                maxWidth: "1000px",
                margin: "20px auto",
                transition: "all 0.3s ease",
                display: "flex",
                gap: "15px",
            }}
        >
            {/* Input Field */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    borderRight: "2px solid #ddd",
                    paddingRight: "10px",
                }}
            >
                <Form.Control
                    as="textarea"
                    rows={1}
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                    className="input-field"
                    style={{
                        resize: "none",
                        border: "none",
                        outline: "none",
                        width: "100%",
                        maxHeight: "250px",
                        overflowY: "auto",
                        backgroundColor: "transparent",
                        fontSize: "16px",
                        color: "#333",
                        padding: "10px",
                    }}
                />
            </div>

            {/* Language Selector */}
            <div>
                <select
                    onChange={(e) => handleLanguageSelect(e.target.value)}
                    style={{
                        backgroundColor: "#fff",
                        border: "1px solid #ddd",
                        borderRadius: "15px",
                        padding: "5px 10px",
                        fontSize: "14px",
                        color: "#555",
                        outline: "none",
                        cursor: "pointer",
                    }}
                >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    {/* Add more languages */}
                </select>
            </div>

            {/* Voice Input Button */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: "2px solid #ddd",
                    paddingRight: "10px",
                }}
            >
                <OverlayTrigger placement="top" overlay={<Tooltip>Record Voice</Tooltip>}>
                    <Button
                        variant="outline-secondary"
                        onClick={handleVoiceInput}
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            color: "#6c757d",
                            borderRadius: "50%",
                            height: "45px",
                            width: "45px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                    >
                        <FaMicrophone />
                    </Button>
                </OverlayTrigger>
            </div>

            {/* Recording Icon */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: "2px solid #ddd",
                    paddingRight: "10px",
                }}
            >
                <OverlayTrigger placement="top" overlay={<Tooltip>Toggle Recording</Tooltip>}>
                    <i
                        id="recording-icon"
                        className="fa fa-microphone"
                        onClick={handleRecordingIconClick}
                        style={{
                            color: isRecording ? 'red' : 'black',
                            cursor: 'pointer',
                            fontSize: '24px',
                            transition: 'color 0.2s',
                        }}
                    ></i>
                </OverlayTrigger>
            </div>

            {/* AI Suggestions Button */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: "2px solid #ddd",
                    paddingRight: "10px",
                }}
            >
                <OverlayTrigger placement="top" overlay={<Tooltip>Get AI Suggestions</Tooltip>}>
                    <Button
                        variant="outline-secondary"
                        onClick={handleAIRequest}
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            color: "#6c757d",
                            borderRadius: "50%",
                            height: "45px",
                            width: "45px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s",
                        }}

                        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.target.style.transform = "scale(1)" )}
                    >
                        
                   <FaLightbulb />
                    </Button>
                </OverlayTrigger>
            </div>


            {/* Play Sound Button */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    borderRight: "2px solid #ddd",
                    paddingRight: "10px",
                }}
            >
                <OverlayTrigger placement="top" overlay={<Tooltip>Play Sound</Tooltip>}>
                    <Button
                        variant="outline-secondary"
                        onClick={handleVoiceOutput}
                        style={{
                            backgroundColor: "white",
                            border: "none",
                            color: "#6c757d",
                            borderRadius: "50%",
                            height: "45px",
                            width: "45px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                    >
                        <FaPlay />
                    </Button>
                </OverlayTrigger>
            </div>

            {/* File Upload */}
            <div>
            <OverlayTrigger placement="top" overlay={<Tooltip>Upload Files</Tooltip>}>
                <label
                    htmlFor="file-upload"
                    style={{
                        backgroundColor: "#f0f0f0",
                        border: "1px solid #ddd",
                        borderRadius: "50%",
                        padding: "10px",
                        color: "#555",
                        cursor: "pointer",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "45px",
                        height: "45px",
                    }}
                >
                <FaPaperclip />
                </label>
                </OverlayTrigger>
                <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileSelection}
                    style={{ display: "none" }}
                />
            </div>

            {/* Send Button */}
            <div>
                <OverlayTrigger placement="top" overlay={<Tooltip>Send Message</Tooltip>}>
                    <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        style={{
                            backgroundColor: "#007bff",
                            border: "none",
                            borderRadius: "50%",
                            padding: "12px",
                            color: "black",
                            fontSize: "20px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                            transition: "transform 0.2s",
                        }}
                        onMouseOver={(e) => (e.target.style.transform = "scale(1.1)")}
                        onMouseOut={(e) => (e.target.style.transform = "scale(1)")}
                    >
                        <FaPaperPlane />
                    </Button>
                </OverlayTrigger>
            </div>
        </div>
    );
};

export default InputArea;