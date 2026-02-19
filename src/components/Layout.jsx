import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaChartBar, FaRobot, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import clsx from 'clsx';

const Layout = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: <FaHome /> },
        { path: '/analytics', label: 'Analytics', icon: <FaChartBar /> },
        { path: '/coach', label: 'AI Coach', icon: <FaRobot /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={clsx(
                    "bg-white shadow-md flex flex-col transition-all duration-300 ease-in-out",
                    sidebarOpen ? "w-64" : "w-0 overflow-hidden"
                )}
            >
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2 whitespace-nowrap">
                        HabitTracker
                    </h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors whitespace-nowrap",
                                location.pathname === item.path
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                        <FaSignOutAlt />
                        Logout
                    </button>
                    {user && <p className="text-xs text-center text-gray-400 mt-2 whitespace-nowrap">Logged in as User {user.id}</p>}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative">
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="absolute top-4 left-4 z-10 p-2 bg-white rounded-lg shadow-md text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
