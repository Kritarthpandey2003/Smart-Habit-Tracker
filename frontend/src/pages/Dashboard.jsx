import React, { useState, useEffect, useContext } from 'react';
import api from '../api';
import HabitCard from '../components/HabitCard';
import { format } from 'date-fns';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const [habits, setHabits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const { user } = useContext(AuthContext);

    // Form state
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitDesc, setNewHabitDesc] = useState('');

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
                frequency: 'daily'
            });
            setNewHabitName('');
            setNewHabitDesc('');
            setShowForm(false);
            fetchHabits();
        } catch (err) {
            alert('Failed to create habit');
        }
    };

    const handleToggleHabit = async (id, status) => {
        const date = format(new Date(), 'yyyy-MM-dd');
        try {
            // Optimistic update
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
            // Re-fetch to ensure consistency (optional)
            fetchHabits();
        } catch (err) {
            console.error("Failed to log habit", err);
            fetchHabits(); // Revert on error
        }
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

    if (loading) return <div className="p-6">Loading habits...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Hello, User</h1>
                    <p className="text-gray-500">Ready to build some habits?</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ New Habit'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-blue-100">
                    <h3 className="font-semibold mb-4">Create New Habit</h3>
                    <form onSubmit={handleCreateHabit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Habit Name</label>
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={e => setNewHabitName(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
                            <input
                                type="text"
                                value={newHabitDesc}
                                onChange={e => setNewHabitDesc(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                            Create Habit
                        </button>
                    </form>
                </div>
            )}

            <div className="grid gap-4">
                {habits.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No habits yet. Start by creating one!</p>
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
        </div>
    );
};

export default Dashboard;
