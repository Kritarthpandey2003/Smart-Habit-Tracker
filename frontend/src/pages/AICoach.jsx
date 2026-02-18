import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { FaPaperPlane, FaRobot, FaUser } from 'react-icons/fa';
import clsx from 'clsx';

const AICoach = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your habit coach. How can I help you stay on track today?" }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/coach/chat', { message: userMsg.content });
            const botMsg = { role: 'assistant', content: res.data.reply };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble thinking right now. Please try again." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mx-4 my-6 lg:mx-auto lg:max-w-4xl" style={{ height: 'calc(100vh - 100px)' }}>
            {/* Header */}
            <div className="bg-blue-600 p-4 text-white flex items-center gap-2">
                <FaRobot className="text-xl" />
                <h2 className="font-semibold">AI Habit Coach</h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={clsx(
                            "flex gap-3 max-w-[80%]",
                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                        )}
                    >
                        <div className={clsx(
                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                        )}>
                            {msg.role === 'user' ? <FaUser /> : <FaRobot />}
                        </div>
                        <div className={clsx(
                            "p-3 rounded-2xl shadow-sm text-sm whitespace-pre-wrap",
                            msg.role === 'user'
                                ? "bg-blue-600 text-white rounded-tr-none"
                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                        )}>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex gap-3 mr-auto items-center">
                        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center shrink-0">
                            <FaRobot />
                        </div>
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm text-gray-500 text-sm italic">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your habits..."
                    className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                    <FaPaperPlane />
                </button>
            </form>
        </div>
    );
};

export default AICoach;
