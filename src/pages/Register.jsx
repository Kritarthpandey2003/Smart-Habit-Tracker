import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { FaFire, FaUser, FaLock, FaRocket } from 'react-icons/fa';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { username, password });
            navigate('/login');
        } catch (err) {
            const status = err.response?.status;
            let dataMsg = err.response?.data?.message;
            if (err.response?.data?.error) {
                dataMsg = `${err.response.data.message} - ${err.response.data.error}`;
            } else if (!dataMsg && err.response?.data) {
                if (typeof err.response.data === 'string') {
                    dataMsg = err.response.data.includes('<!DOCTYPE html>')
                        ? "Server returned an HTML error page."
                        : err.response.data.slice(0, 150);
                }
            }
            setError(`Failed (${status || '?'}): ${dataMsg || err.message || "Unknown error"}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-animated relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-10 right-20 w-80 h-80 bg-emerald-400/30 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-20 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl" style={{ animation: 'float 4s ease-in-out infinite' }} />
            <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" style={{ animation: 'float 5s ease-in-out infinite' }} />

            <div className="relative z-10 max-w-md w-full mx-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 animate-float mb-4">
                        <FaRocket className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Join HabitTracker</h1>
                    <p className="text-white/70 mt-1">Start your journey today</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-6">Create Account</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-4 text-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium">Username</label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/80 transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Choose a username"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-gray-600 mb-2 text-sm font-medium">Password</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="password"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 bg-white/80 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl hover:from-emerald-600 hover:to-cyan-600 transition-all duration-300 font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
                        >
                            🚀 Get Started
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Footer */}
                <p className="text-center text-white/40 text-xs mt-6">
                    Created by <span className="text-white/60 font-medium">Kritarth Pandey</span>
                </p>
            </div>
        </div>
    );
};

export default Register;
