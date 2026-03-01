import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import HabitCard from '../components/HabitCard';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaTimes, FaStar } from 'react-icons/fa';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(AuthContext);

    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitDesc, setNewHabitDesc] = useState('');
    const [newHabitReminder, setNewHabitReminder] = useState('');
    const [triggeredAlarms, setTriggeredAlarms] = useState(new Set());
    const [toast, setToast] = useState(null);

    const fetchHabits = async () => {
        try {
            const res = await api.get('/habits');
            setHabits(res.data);
        } catch (err) {
            console.error("Failed to fetch habits", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleCreateHabit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/habits', {
                name: newHabitName,
                description: newHabitDesc,
                frequency: 'daily',
                reminderTime: newHabitReminder
            });
            setNewHabitName('');
            setNewHabitDesc('');
            setNewHabitReminder('');
            setShowForm(false);
            fetchHabits();
        } catch (err) {
            const msg = err.response?.data?.message || err.message || 'Failed to create habit';
            alert(`Failed to create habit: ${msg}`);
        }
    };

    const handleToggleHabit = async (id, status) => {
        const date = format(new Date(), 'yyyy-MM-dd');
        try {
            setHabits(prev => prev.map(h => {
                if (h.id === id) {
                    const exists = h.logs.some(l => l.date === date);
                    let newLogs = [...h.logs];
                    if (exists) {
                        newLogs = newLogs.map(l => l.date === date ? { ...l, status } : l);
                    } else {
                        newLogs.push({ date, status, habit_id: id, id: 'temp' });
                    }
                    return { ...h, logs: newLogs };
                }
                return h;
            }));
            await api.post(`/habits/${id}/log`, { date, status });
            fetchHabits();
        } catch (err) {
            console.error("Failed to log habit", err);
            fetchHabits();
        }
    };

    // Background checker for alarms
    useEffect(() => {
        const interval = setInterval(() => {
            if (habits.length === 0) return;
            const now = new Date();
            const currentTime = format(now, 'HH:mm');
            const dateStr = format(now, 'yyyy-MM-dd');

            habits.forEach(habit => {
                if (!habit.reminder_time) return;

                // check if it's completed today
                const isCompletedToday = habit.logs && habit.logs.some(l => l.date === dateStr && l.status);
                if (isCompletedToday) return;

                if (habit.reminder_time === currentTime) {
                    const alarmKey = `${habit.id}-${dateStr}-${currentTime}`;
                    setTriggeredAlarms(prev => {
                        if (prev.has(alarmKey)) return prev;
                        // Trigger alarm
                        const newSet = new Set(prev).add(alarmKey);
                        triggerAlarm(habit.name);
                        return newSet;
                    });
                }
            });
        }, 10000); // Check every 10 seconds

        return () => clearInterval(interval);
    }, [habits]);

    const triggerAlarm = (habitName) => {
        try {
            const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

            oscillator.start();
            setTimeout(() => oscillator.stop(), 500);

            setTimeout(() => {
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.type = 'sine';
                osc2.frequency.setValueAtTime(880, audioCtx.currentTime);
                gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
                osc2.start();
                setTimeout(() => osc2.stop(), 500);
            }, 600);
        } catch (e) {
            console.error("Audio block from browser", e);
        }

        setToast(`⏰ Time for your habit: ${habitName}!`);
        setTimeout(() => setToast(null), 8000);
    };

    const handleDeleteHabit = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/habits/${id}`);
            setHabits(prev => prev.filter(h => h.id !== id));
        } catch (err) {
            alert('Failed to delete');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Loading your habits...</p>
            </div>
        </div>
    );

    const completedToday = habits.filter(h => {
        const today = format(new Date(), 'yyyy-MM-dd');
        return h.logs.some(l => l.date === today && l.status);
    }).length;

    return (
        <div className="p-8 pt-16 max-w-4xl mx-auto">
            {/* Header with stats */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            Hello, {user?.username} 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Ready to build some habits?</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 ${showForm
                            ? 'bg-gray-100 text-gray-600 shadow-gray-200 hover:bg-gray-200'
                            : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-purple-500/30 hover:shadow-purple-500/50'
                            }`}
                    >
                        {showForm ? <><FaTimes /> Cancel</> : <><FaPlus /> New Habit</>}
                    </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-4 text-white shadow-lg shadow-indigo-500/20">
                        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wider">Total Habits</p>
                        <p className="text-3xl font-bold mt-1">{habits.length}</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-4 text-white shadow-lg shadow-emerald-500/20">
                        <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">Done Today</p>
                        <p className="text-3xl font-bold mt-1">{completedToday}</p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-4 text-white shadow-lg shadow-amber-500/20">
                        <p className="text-amber-200 text-xs font-medium uppercase tracking-wider">Completion</p>
                        <p className="text-3xl font-bold mt-1">{habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0}%</p>
                    </div>
                </div>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="glass-card rounded-2xl shadow-xl p-6 mb-8 border border-purple-100">
                    <h3 className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center gap-2">
                        <FaStar className="text-yellow-500" /> Create New Habit
                    </h3>
                    <form onSubmit={handleCreateHabit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Habit Name</label>
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                className="block w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white/80 transition-all"
                                placeholder="e.g. Morning Meditation"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Description (Optional)</label>
                            <input
                                type="text"
                                value={newHabitDesc}
                                onChange={e => setNewHabitDesc(e.target.value)}
                                className="block w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white/80 transition-all"
                                placeholder="Brief description of your habit"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Reminder Time (Optional)</label>
                            <input
                                type="time"
                                value={newHabitReminder}
                                onChange={e => setNewHabitReminder(e.target.value)}
                                className="block w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 bg-white/80 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-xl hover:from-indigo-700 hover:to-purple-700 font-semibold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all hover:-translate-y-0.5"
                        >
                            ✨ Create Habit
                        </button>
                    </form>
                </div>
            )}

            {/* Habits List */}
            <div className="grid gap-4">
                {habits.length === 0 ? (
                    <div className="text-center py-16 bg-white/60 rounded-2xl border-2 border-dashed border-purple-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FaStar className="text-purple-400 text-2xl" />
                        </div>
                        <p className="text-gray-500 font-medium">No habits yet</p>
                        <p className="text-gray-400 text-sm mt-1">Click "New Habit" to start your journey!</p>
                    </div>
                ) : (
                    habits.map(habit => (
                        <HabitCard
                            key={habit.id}
                            habit={habit}
                            onToggle={handleToggleHabit}
                            onDelete={handleDeleteHabit}
                        />
                    ))
                )}
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className="fixed bottom-6 right-6 bg-white shadow-2xl border border-purple-100 rounded-2xl p-4 flex items-center gap-4 animate-bounce z-50 transition-all transform hover:scale-105">
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
                        🔔
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800">Reminder!</h4>
                        <p className="text-gray-600 font-medium">{toast}</p>
                    </div>
                    <button
                        onClick={() => setToast(null)}
                        className="ml-4 text-gray-400 hover:text-gray-600"
                    >
                        <FaTimes />
                    </button>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
