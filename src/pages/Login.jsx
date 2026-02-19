import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaFire, FaUser, FaLock } from 'react-icons/fa';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(username, password);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-animated relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl" style={{ animation: 'float 4s ease-in-out infinite' }} />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl" style={{ animation: 'float 5s ease-in-out infinite' }} />

            <div className="relative z-10 max-w-md w-full mx-4">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-orange-500/30 animate-float mb-4">
                        <FaFire className="text-white text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">HabitTracker</h1>
                    <p className="text-white/70 mt-1">Build better habits daily</p>
                </div>

                {/* Card */}
                <div className="glass-card rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">Welcome Back</h2>

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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white/80 transition-all"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter username"
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
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white/80 transition-all"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="mt-6 text-center text-gray-500 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-purple-600 hover:text-purple-800 font-semibold transition-colors">
                            Create one
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

export default Login;
