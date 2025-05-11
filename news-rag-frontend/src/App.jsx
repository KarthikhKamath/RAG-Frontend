import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export default function ChatInterface() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Create or get session on load
  useEffect(() => {
    const existingSessionId = localStorage.getItem('sessionId');
    
    if (existingSessionId) {
      setSessionId(existingSessionId);
      fetchHistory(existingSessionId);
    } else {
      initSession();
    }
  }, []);

  // Initialize session
  const initSession = async () => {
    try {
      const res = await axios.post(`${baseURL}/session`);
      const newSessionId = res.data.session_id;
      setSessionId(newSessionId);
      console.log("The new session id  is", newSessionId)
      localStorage.setItem('sessionId', newSessionId);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  // Fetch history for a given sessionId
  const fetchHistory = async (sessionId) => {
    try {
      const res = await axios.get(`${baseURL}/history`, { params: { session_id: sessionId } });
      setMessages(res.data.history);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(`${baseURL}/query`, {
        session_id: sessionId,
        query: userMessage.text,
        n_results: 15,
      });

      const botMessage = { role: 'bot', text: res.data.answer };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Query failed:', err);
    }
  };

  // Clear session and reset state
  const clearSession = async () => {
    if (!sessionId) return;

    try {
      await axios.delete(`${baseURL}/session`, { data: { session_id: sessionId } });
      localStorage.removeItem('sessionId');
      setSessionId(null);
      setMessages([]);
    } catch (err) {
      console.error('Failed to clear session:', err);
    }
  };

  // Start new session
  const startNewSession = async () => {
    await clearSession();
    await initSession();
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto min-h-screen p-4 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4 text-center">Chat with AI</h1>

      <div className="flex-1 overflow-y-auto space-y-2 mb-4 bg-white rounded-lg p-4 shadow">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] px-4 py-2 rounded-lg ${
              msg.role === 'user'
                ? 'ml-auto bg-blue-500 text-white'
                : 'mr-auto bg-gray-200 text-gray-900'
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-lg mb-2 sm:mb-0"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-2 sm:mb-0"
        >
          Send
        </button>
        <button
          onClick={startNewSession}
          className="bg-green-500 text-white px-3 py-2 rounded-lg mb-2 sm:mb-0"
        >
          Start New Session
        </button>
      </div>
    </div>
  );
}
