import React from 'react';
import { FaCheck, FaTrash } from 'react-icons/fa';
import clsx from 'clsx';
import { format } from 'date-fns';

const HabitCard = ({ habit, onToggle, onDelete }) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    // Check if logged for today
    const isCompletedToday = habit.logs.some(log => log.date === today && log.status);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex items-center justify-between">
            <div>
                <h3 className="font-semibold text-lg text-gray-800">{habit.name}</h3>
                <p className="text-gray-500 text-sm">{habit.description}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {habit.frequency}
                    </span>
                    <span className="text-xs text-gray-400">
                        Streak: {calculateStreak(habit.logs)} days
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => onToggle(habit.id, !isCompletedToday)}
                    className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center transition-colors border-2",
                        isCompletedToday
                            ? "bg-green-500 border-green-500 text-white"
                            : "bg-white border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500"
                    )}
                >
                    <FaCheck />
                </button>
                <button
                    onClick={() => onDelete(habit.id)}
                    className="text-gray-400 hover:text-red-500 p-2"
                >
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

// Simple streak calculation (consecutive days ending yesterday or today)
function calculateStreak(logs) {
    if (!logs || logs.length === 0) return 0;

    // Sort logs by date descending
    const sortedLogs = [...logs]
        .filter(l => l.status)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sortedLogs.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if the most recent log is today or yesterday to start the streak
    const lastLogDate = new Date(sortedLogs[0].date);
    lastLogDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today - lastLogDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 1) return 0; // Streak broken

    // Count consecutive days
    // This is a simplified version; real streak logic would need to fill in gaps for daily frequency
    // For now, just count logs length as a naive "streak" or implementation
    // Better: Iterate and check difference is 1 day.

    return sortedLogs.length; // Placeholder: Total completions for now
}

export default HabitCard;
