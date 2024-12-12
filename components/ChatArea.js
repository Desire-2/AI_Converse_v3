import React, { useState } from "react";
import {
  Card,
  Button,
  DropdownButton,
  Dropdown,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { FaCopy, FaEdit, FaSearch, FaDownload, FaFont } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeBlock from "./CodeBlock";
import {exportConversation, handleCopy, toggleExpandMessage, handleEditMessage} from "./exportChartFunc"

const ChatArea = ({ messages, theme }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedMessages, setExpandedMessages] = useState({});
  const [editingMessage, setEditingMessage] = useState(null);
  const [fontSize, setFontSize] = useState(14);
  const [isTyping, setIsTyping] = useState(false);

// Edit message
const handleEditMessage = (index, newContent) => {
  alert(`Message ${index + 1} updated to: ${newContent}`);
  setEditingMessage(null);
};

  // Render message content
const renderMessageContent = (content, index) => {
  const isExpanded = expandedMessages[index];
  const codeBlockRegex = /```([\s\S]*?)```/g;
  const parts = content.split(codeBlockRegex);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <CodeBlock key={i} code={part} />
        ) : (
          <ReactMarkdown key={i} remarkPlugins={[remarkGfm]}>
            {isExpanded ? part : `${part.slice(0, 200)}${part.length > 200 ? "..." : ""}`}
          </ReactMarkdown>
        )
      )}
      {content.length > 200 && (
        <Button
          variant="link"
          size="sm"
          onClick={() => toggleExpandMessage(index)}
          style={{ textDecoration: "none" }}
        >
          {isExpanded ? "Show Less" : "Read More"}
        </Button>
      )}
    </>
  );
};



  
  return (
    <Card
      className="chat-card shadow-lg"
      style={{
        borderRadius: "15px",
        backgroundColor: theme === "light" ? "#ffffff" : "#333333",
        border: "none",
      }}
    >
      <Card.Body style={{ padding: "20px" }}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3
            className="text-center"
            style={{
              fontFamily: "cursive",
              color: theme === "light" ? "#4a90e2" : "#f9a602",
            }}
          >
            AI Converse
          </h3>
          <DropdownButton
            id="dropdown-basic-button"
            title={
              <>
                <FaDownload /> Export
              </>
            }
            variant="outline-primary"
          >
            <Dropdown.Item onClick={() => exportConversation("json")}>
              Export as JSON
            </Dropdown.Item>
            <Dropdown.Item onClick={() => exportConversation("pdf")}>
              Export as PDF
            </Dropdown.Item>
          </DropdownButton>
        </div>

        {/* Search Bar */}
        <div className="d-flex align-items-center mb-3">
          <Form.Control
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          <FaSearch />
        </div>

        {/* Font Size Adjuster */}
        <div className="d-flex align-items-center mb-3">
          <FaFont style={{ marginRight: "10px" }} />
          <Form.Range
            min={12}
            max={24}
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            style={{ flex: 1 }}
          />
        </div>

        {/* Messages */}
        <div
          id="conversation-container"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            backgroundColor: theme === "light" ? "#f9f9f9" : "#1a1a1a",
            padding: "20px",
            borderRadius: "15px",
            fontSize: `${fontSize}px`,
            border: theme === "light" ? "1px solid #ddd" : "1px solid #444",
          }}
        >
          {messages
            .filter((msg) =>
              msg.content.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((msg, index) => (
              <div
                key={index}
                className={`d-flex ${
                  msg.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                } my-3`}
              >
                <div
                  style={{
                    maxWidth: "70%",
                    wordWrap: "break-word",
                    padding: "15px",
                    borderRadius: "15px",
                    backgroundColor: msg.role === "user" ? "#4a90e2" : "#f9a602",
                    color: "#fff",
                  }}
                >
                  {renderMessageContent(msg.content, index)}
                  <small className="text-muted" style={{ display: "block", marginTop: "5px", textAlign: "right" }}>
                    {msg.timestamp}
                  </small>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "5px",
                    }}
                  >
                    {msg.role === "bot" && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => handleCopy(msg.content)}
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        <FaCopy /> Copy
                      </Button>
                    )}
                    {msg.role === "user" && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => setEditingMessage(index)}
                        style={{ color: "#fff", textDecoration: "none" }}
                      >
                        <FaEdit /> Edit
                      </Button>
                    )}
                  </div>
                  {editingMessage === index && (
                    <Form.Control
                      type="text"
                      defaultValue={msg.content}
                      onBlur={(e) => handleEditMessage(index, e.target.value)}
                      autoFocus
                    />
                  )}
                </div>
              </div>
            ))}
          {isTyping && (
            <div className="d-flex justify-content-start my-3">
              <div
                style={{
                  maxWidth: "70%",
                  padding: "15px",
                  borderRadius: "15px",
                  backgroundColor: theme === "light" ? "#e0e0e0" : "#333",
                  color: theme === "light" ? "#000" : "#fff",
                }}
              >
                AI Converse is typing...
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChatArea;
