'use client'
import { useState } from 'react';
import axios from 'axios';
import styles from '../styles/chatbot.module.css';

function Chatbot() {
    const [messages, setMessages] = useState([{ type: 'bot', content: 'Hello! How can I assist you?' }]);
    const [inputValue, setInputValue] = useState('');

    const sendMessage = async () => {
        setMessages([...messages, { type: 'user', content: inputValue }]);

        try {
            const response = await axios.post('http://localhost:8000/chat/', { content: inputValue });
            const botMessage = {
                content: response.data.response,
                type: 'bot',
                uuid: response.data.uuid,  // store the UUID
            };
            setMessages(prevMessages => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
        }

        setInputValue('');
    };

    const handleFeedback = async (index, feedback) => {
        const selectedMessage = messages[index];
        const uuid = selectedMessage.uuid;

        // Send feedback to the backend
        try {
            await axios.post(`http://localhost:8000/feedback/${uuid}/`, {
                feedback: feedback
            });
            const updatedMessages = [...messages];
            updatedMessages[index].feedback = feedback;
            setMessages(updatedMessages);
        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    }; 
    
    const clearHistory = () => {
        setMessages([]);
    };

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                Fiddlers Green Chatbot
                <button className={styles.clearButton} onClick={clearHistory}>Clear History</button>
            </div>
            <div className={styles.chatBody}>
                {messages.map((message, index) => (
                    <div key={index} className={`${styles.message} ${message.type === 'bot' ? styles.botMessage : styles.userMessage}`}>
                        {message.content}
                        {message.type === 'bot' && !message.feedback && (
                            <div className={styles.feedbackContainer}>
                                <span>Was this helpful?</span>
                                <button onClick={() => handleFeedback(index, "yes")}>Yes</button>
                                <button onClick={() => handleFeedback(index, "no")}>No</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className={styles.inputContainer}>
                <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button className={styles.sendButton} onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chatbot;