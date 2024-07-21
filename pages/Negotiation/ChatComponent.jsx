import React, { useState } from "react";
import styles from "./Styles/ChatComponent.module.css";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      // Simulate receiving a reply from the developer/customer
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "Response from developer/customer", sender: "other" },
        ]);
      }, 1000);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>Chat</div>
      <div className={styles.chatMessages}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.sender === "user"
                ? styles.userMessage
                : styles.otherMessage
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className={styles.chatInputContainer}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.chatInput}
          placeholder="Type a message"
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
