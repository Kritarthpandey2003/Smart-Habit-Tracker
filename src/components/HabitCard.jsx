import React from 'react';
import { FaCheck, FaTrash, FaFire } from 'react-icons/fa';
import clsx from 'clsx';
import { format } from 'date-fns';

const habitColors = [
    { bg: 'from-indigo-500 to-purple-500', light: 'bg-indigo-50', text: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700' },
    { bg: 'from-emerald-500 to-teal-500', light: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700' },
    { bg: 'from-amber-500 to-orange-500', light: 'bg-amber-50', text: 'text-amber-600', badge: 'bg-amber-100 text-amber-700' },
    { bg: 'from-pink-500 to-rose-500', light: 'bg-pink-50', text: 'text-pink-600', badge: 'bg-pink-100 text-pink-700' },
    { bg: 'from-cyan-500 to-blue-500', light: 'bg-cyan-50', text: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700' },
];

const HabitCard = ({ habit, onToggle, onDelete }) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const isCompletedToday = habit.logs.some(log => log.date === today && log.status);
    const colorIndex = (habit.id || 0) % habitColors.length;
    const colors = habitColors[colorIndex];
    const streak = calculateStreak(habit.logs);

    return (
        <div className={clsx(
            "bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden",
            isCompletedToday ? "border-emerald-200" : "border-gray-100"
        )}>
            <div className="flex items-center">
                {/* Color accent bar */}
                <div className={clsx("w-1.5 self-stretch bg-gradient-to-b", colors.bg)} />

                <div className="flex-1 p-5 flex items-center justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={clsx("font-bold text-lg", isCompletedToday ? "text-gray-400 line-through" : "text-gray-800")}>
                                {habit.name}
                            </h3>
                            {isCompletedToday && (
                                <span className="text-xs font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                                    ✓ Done
                                </span>
                            )}
                        </div>
                        {habit.description && (
                            <p className="text-gray-400 text-sm mt-0.5">{habit.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                            <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded-full", colors.badge)}>
                                {habit.frequency === 'custom' && habit.recurrence_days
                                    ? habit.recurrence_days.split(',').map(d => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][parseInt(d)]).join(', ')
                                    : habit.frequency}
                            </span>
                            {habit.reminder_time && (
                                <span className={clsx("text-xs font-semibold px-2.5 py-1 rounded-full border bg-white shadow-sm flex items-center gap-1", isCompletedToday ? "text-gray-400 border-gray-100" : "text-gray-600 border-gray-200")}>
                                    ⏰ {habit.reminder_time}
                                </span>
                            )}
                            {streak > 0 && (
                                <span className="text-xs font-medium text-amber-600 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full">
                                    <FaFire className="text-orange-500" /> {streak} day streak
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                        <button
                            onClick={() => onToggle(habit.id, !isCompletedToday)}
                            className={clsx(
                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 border-2 shadow-sm",
                                isCompletedToday
                                    ? "bg-gradient-to-br from-emerald-400 to-teal-500 border-emerald-400 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50"
                                    : "bg-white border-gray-200 text-gray-300 hover:border-emerald-400 hover:text-emerald-500 hover:shadow-emerald-500/20"
                            )}
                        >
                            <FaCheck />
                        </button>
                        <button
                            onClick={() => onDelete(habit.id)}
                            className="text-gray-300 hover:text-red-500 p-2 transition-colors hover:bg-red-50 rounded-lg"
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

function calculateStreak(logs) {
    if (!logs || logs.length === 0) return 0;
    const sortedLogs = [...logs]
        .filter(l => l.status)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortedLogs.length === 0) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastLogDate = new Date(sortedLogs[0].date);
    lastLogDate.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today - lastLogDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 1) return 0;
    return sortedLogs.length;
}

export default HabitCard;
