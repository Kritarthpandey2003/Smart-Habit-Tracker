import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // Register API call directly or via context if exposed
            await api.post('/auth/register', { username, password });
            navigate('/login');
        } catch (err) {
            console.error("Registration Error Details:", err);
            const status = err.response?.status;
            let dataMsg = err.response?.data?.message;

            if (err.response?.data?.error) {
                // Backend returned a specific error structure (from our new handler)
                dataMsg = `Error: ${err.response.data.message} - ${err.response.data.error}`;
            } else if (!dataMsg && err.response?.data) {
                if (typeof err.response.data === 'string') {
                    if (err.response.data.includes('<!DOCTYPE html>')) {
                        dataMsg = "Server returned an HTML error page. See console.";
                    } else {
                        dataMsg = err.response.data.slice(0, 150); // Show a snippet of the error
                    }
                } else {
                    try {
                        dataMsg = JSON.stringify(err.response.data);
                    } catch (e) {
                        dataMsg = "Unknown data format";
                    }
                }
            }

            const fallback = err.message || "Unknown error";
            setError(`Failed (${status || '?'}): ${dataMsg || fallback}`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Account</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 transition duration-200"
                    >
                        Register
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
