import React, { useState, useContext } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHome, FaChartBar, FaRobot, FaSignOutAlt, FaBars, FaTimes, FaFire } from 'react-icons/fa';
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
        { path: '/', label: 'Dashboard', icon: <FaHome />, color: 'from-blue-500 to-cyan-400' },
        { path: '/analytics', label: 'Analytics', icon: <FaChartBar />, color: 'from-purple-500 to-pink-400' },
        { path: '/coach', label: 'AI Coach', icon: <FaRobot />, color: 'from-emerald-500 to-teal-400' },
    ];

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Sidebar */}
            <div
                className={clsx(
                    "flex flex-col transition-all duration-300 ease-in-out relative",
                    sidebarOpen ? "w-72" : "w-0 overflow-hidden"
                )}
            >
                {/* Sidebar gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-600 via-purple-600 to-pink-600 opacity-95" />
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvZz48L3N2Zz4=')] opacity-30" />

                <div className="relative z-10 flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/10">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3 whitespace-nowrap">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg animate-float">
                                <FaFire className="text-white text-lg" />
                            </div>
                            HabitTracker
                        </h1>
                        <p className="text-purple-200 text-xs mt-2 whitespace-nowrap">Build better habits daily</p>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={clsx(
                                    "flex items-center gap-3 p-3 rounded-xl transition-all duration-200 whitespace-nowrap group",
                                    location.pathname === item.path
                                        ? "bg-white/20 text-white shadow-lg backdrop-blur-sm"
                                        : "text-purple-200 hover:bg-white/10 hover:text-white"
                                )}
                            >
                                <div className={clsx(
                                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all",
                                    location.pathname === item.path
                                        ? `bg-gradient-to-br ${item.color} shadow-md`
                                        : "bg-white/10 group-hover:bg-white/20"
                                )}>
                                    {item.icon}
                                </div>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Logout + User */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 p-3 w-full text-pink-200 hover:bg-white/10 hover:text-white rounded-xl transition-all whitespace-nowrap"
                        >
                            <div className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center">
                                <FaSignOutAlt />
                            </div>
                            Logout
                        </button>
                        {user && (
                            <div className="mt-3 p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                <p className="text-xs text-purple-200 whitespace-nowrap">👋 Logged in as</p>
                                <p className="text-sm font-semibold text-white whitespace-nowrap">{user.username || `User ${user.id}`}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto relative flex flex-col">
                {/* Toggle Button */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={clsx(
                        "fixed top-4 z-20 p-3 rounded-xl shadow-lg transition-all duration-300",
                        sidebarOpen
                            ? "left-[17rem] bg-white/90 backdrop-blur-sm text-purple-600 hover:bg-purple-50 hover:shadow-purple-200"
                            : "left-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-purple-300"
                    )}
                    title={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
                >
                    {sidebarOpen ? <FaTimes /> : <FaBars />}
                </button>

                {/* Page Content */}
                <div className="flex-1">
                    <Outlet />
                </div>

                {/* Footer Credit */}
                <div className="text-right px-6 py-3">
                    <p className="text-xs text-gray-400 font-medium">
                        Created by <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent font-semibold">Kritarth Pandey</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Layout;
