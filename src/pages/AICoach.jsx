import React, { useState, useRef, useEffect } from 'react';
import api from '../api';
import { FaPaperPlane, FaRobot, FaUser, FaSparkles } from 'react-icons/fa';
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
        <div className="flex flex-col mx-4 my-6 pt-10 lg:mx-auto lg:max-w-4xl" style={{ height: 'calc(100vh - 100px)' }}>
            {/* Chat Container */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-5 text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <FaRobot className="text-xl" />
                    </div>
                    <div>
                        <h2 className="font-bold text-lg">AI Habit Coach</h2>
                        <p className="text-emerald-100 text-xs">Powered by AI • Always here to help</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
                        <span className="text-emerald-100 text-xs font-medium">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-gray-50 to-white">
                    {messages.map((msg, idx) => (
                        <div
                            key={idx}
                            className={clsx(
                                "flex gap-3 max-w-[80%] animate-in",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                            )}
                        >
                            <div className={clsx(
                                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                                    : "bg-gradient-to-br from-emerald-500 to-teal-500 text-white"
                            )}>
                                {msg.role === 'user' ? <FaUser className="text-xs" /> : <FaRobot className="text-xs" />}
                            </div>
                            <div className={clsx(
                                "p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap",
                                msg.role === 'user'
                                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-tr-md"
                                    : "bg-white text-gray-700 border border-gray-100 rounded-tl-md"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex gap-3 mr-auto items-center">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <FaRobot className="text-xs" />
                            </div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-md border border-gray-100 shadow-sm">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100 flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your habits..."
                        className="flex-1 p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-gray-50 transition-all"
                        disabled={loading}
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white w-12 h-12 rounded-xl flex items-center justify-center hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                    >
                        <FaPaperPlane />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AICoach;
