import React, { useState } from "react";
import { Button, ToggleButton, ToggleButtonGroup, Form, Modal, Tooltip, OverlayTrigger } from "react-bootstrap";
import {
    FaTrash,
    FaSun,
    FaMoon,
    FaEdit,
    FaPlus,
    FaThumbtack,
    FaUsers,
    FaFileExport,
    FaSearch,
} from "react-icons/fa";

const Sidebar = ({
    theme,
    handleThemeToggle,
    conversationHistory = [],
    setMessages,
    deleteHistory,
    handleRenameChat,
    handleDeleteChat,
    handleExportHistory,
    onPinChat,
    pinnedChats = [],
    handlePinChat,
    groupChats = [],
    handleViewGroupChats,
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isPinnedOpen, setPinnedOpen] = useState(true);
    const [isHistoryOpen, setHistoryOpen] = useState(true);
    const [showGroups, setShowGroups] = useState(false);

    const filteredHistory = conversationHistory.filter((chat) =>
        chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div
            className="sidebar"
            style={{
                width: "350px",
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: theme === "light" ? "#f0f0f0" : "#2c2c2c",
                borderRight: `2px solid ${theme === "light" ? "#ddd" : "#444"}`,
                overflowY: "auto",
                padding: "15px",
            }}
        >
            <h5
                style={{
                    color: theme === "light" ? "#4a90e2" : "#f9a602",
                    textAlign: "center",
                    marginBottom: "20px",
                }}
            >
                Menu
            </h5>

            {/* Search Bar */}
            <Form.Group controlId="searchBar" className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        backgroundColor: theme === "light" ? "#ffffff" : "#3a3a3a",
                        borderColor: theme === "light" ? "#ddd" : "#444",
                        color: theme === "light" ? "#000" : "#fff",
                    }}
                />
                <FaSearch
                    style={{
                        position: "absolute",
                        right: "20px",
                        top: "35px",
                        color: theme === "light" ? "#888" : "#bbb",
                    }}
                />
            </Form.Group>

            {/* Clear History */}
            <OverlayTrigger placement="right" overlay={<Tooltip>Clear all chat history</Tooltip>}>
                <Button
                    variant="outline-primary"
                    onClick={deleteHistory}
                    className="mb-3"
                    style={{ width: "100%" }}
                >
                    <FaTrash style={{ marginRight: "8px" }} /> Clear History
                </Button>
            </OverlayTrigger>

            {/* Theme Toggle */}
            <ToggleButtonGroup
                type="radio"
                name="theme-toggle"
                value={theme}
                onChange={handleThemeToggle}
                className="mb-3"
                style={{ width: "100%" }}
            >
                <ToggleButton variant="outline-primary" value="light" style={{ width: "50%" }}>
                    <FaSun style={{ marginRight: "8px" }} /> Light
                </ToggleButton>
                <ToggleButton variant="outline-secondary" value="dark" style={{ width: "50%" }}>
                    <FaMoon style={{ marginRight: "8px" }} /> Dark
                </ToggleButton>
            </ToggleButtonGroup>

            {/* Start New Chat */}
            <OverlayTrigger placement="right" overlay={<Tooltip>Start a new chat</Tooltip>}>
                <Button
                    variant="outline-success"
                    onClick={() => setMessages([])}
                    className="mb-3"
                    style={{ width: "100%" }}
                >
                    <FaPlus style={{ marginRight: "8px" }} /> Start New Chat
                </Button>
            </OverlayTrigger>

            {/* Pinned Chats */}
            <div className="mb-3">
                <h6
                    onClick={() => setPinnedOpen(!isPinnedOpen)}
                    style={{
                        cursor: "pointer",
                        color: theme === "light" ? "#333" : "#ccc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Pinned Chats
                    <FaThumbtack style={{ transform: isPinnedOpen ? "rotate(0deg)" : "rotate(90deg)" }} />
                </h6>
                {isPinnedOpen &&
                    pinnedChats.map((chat, index) => (
                        <div
                            key={index}
                            className="d-flex align-items-center justify-content-between mb-2"
                            style={{
                                backgroundColor: theme === "light" ? "#e9ecef" : "#3a3a3a",
                                borderRadius: "8px",
                                padding: "8px",
                            }}
                        >
                             <Button
                                variant="outline-secondary"
                                onClick={() => setMessages(chat.messages)}
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {chat?.name}
                            </Button>
                        </div>
                    ))}
            </div>

            {/* Conversation History */}
            <div className="mb-3">
                <h6
                    onClick={() => setHistoryOpen(!isHistoryOpen)}
                    style={{
                        cursor: "pointer",
                        color: theme === "light" ? "#333" : "#ccc",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    Conversation History
                    <FaFileExport style={{ transform: isHistoryOpen ? "rotate(0deg)" : "rotate(90deg)" }} />
                </h6>
                {isHistoryOpen &&
                    filteredHistory.map((chat, index) => (
                        <div
                            key={index}
                            className="mb-2 d-flex align-items-center justify-content-between"
                            style={{
                                backgroundColor: theme === "light" ? "#e9ecef" : "#3a3a3a",
                                borderRadius: "8px",
                                padding: "8px",
                            }}
                        >
                            <OverlayTrigger placement="right" overlay={<Tooltip> {chat.name}</Tooltip>}>
                            <Button
                                variant="outline-secondary"
                                onClick={() => setMessages(chat.messages)}
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {chat.name}
                            </Button>
                            </OverlayTrigger>
                            <div>
                                <OverlayTrigger placement="right" overlay={<Tooltip>Pin the chat</Tooltip>}>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handlePinChat(chat)}
                                        style={{ marginRight: "4px" }}
                                    >
                                        <FaThumbtack />
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="right" overlay={<Tooltip>Export the chat</Tooltip>}>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => handleExportHistory(chat)}
                                        style={{ marginRight: "4px" }}
                                    >
                                        <FaFileExport />
                                    </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="right" overlay={<Tooltip>Rename the chart</Tooltip>}>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleRenameChat(index)}
                                    style={{ marginRight: "4px" }}
                                >
                                    <FaEdit />
                                </Button>
                                </OverlayTrigger>
                                <OverlayTrigger placement="right" overlay={<Tooltip>Delete the chat</Tooltip>}>
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => handleDeleteChat(index)}
                                >
                                    <FaTrash />
                                </Button>
                                </OverlayTrigger>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Group Chats Button */}
            <div className="group-chats mt-4">
                <Button variant="outline-secondary" onClick={() => setShowGroups(true)}>
                    <FaUsers /> Group Chats
                </Button>
            </div>

            {/* Modal for Group Chats */}
            <Modal show={showGroups} onHide={() => setShowGroups(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Group Chats</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Group chat functionality coming soon!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowGroups(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        
        </div>
    );
};

export default Sidebar;
