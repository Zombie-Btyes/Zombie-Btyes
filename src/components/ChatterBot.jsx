import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ChatterBot = ({ initialMessages }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [Messages, setMessages] = useState(initialMessages || []);
  const [loading, setLoading] = useState(false);
  const messagesContainer = useRef(null);
  const messageInput = useRef(null);

  const toggleButton = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleSendMessage = async () => {
    const newMessage = messageInput.current.value.trim();
    if (newMessage) {
      setMessages([...Messages, { text: newMessage, isSystemMessage: false }]);
      messageInput.current.value = "";
      setLoading(true);
      try {
        const res = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: newMessage,
              },
            ],
            max_tokens: 150,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            },
          }
        );
        const reply = res.data.choices[0].message.content;
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: reply, isSystemMessage: true },
        ]);
      } catch (error) {
        console.error("Error fetching data from OpenAI API:", error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Something went wrong. Please try again.", isSystemMessage: true },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (messagesContainer.current) {
      messagesContainer.current.scrollTop = messagesContainer.current.scrollHeight;
    }
  }, [Messages]);

  return (
    <div className={`ChatToggle ${isOpen ? "open" : "closed"}`}>
      <button className="toggle-icon" onClick={toggleButton}>
        {isOpen ? "❌" : <img src="/image/message_9482525.png"/>}
      </button>
      {isOpen && (
        <>
          <div className="Chatter-Box">
            <h3>Trip Planner Bot</h3>
          </div>
          <div className="MessageBox" ref={messagesContainer}>
            {Messages.length > 0 ? (
              Messages.map((message, index) => (
                <div
                  key={index}
                  className={message.isSystemMessage ? "system-message" : "message"}
                >
                  <p>{message.text}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "black" }}>No messages yet.</p>
            )}
          </div>
          <div id="message-input-container">
            <textarea
              ref={messageInput}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button onClick={handleSendMessage} disabled={loading}>
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatterBot;