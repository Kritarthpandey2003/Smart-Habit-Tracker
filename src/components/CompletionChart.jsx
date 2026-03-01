import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const CompletionChart = ({ habits }) => {
    // Generate last 7 days data
    const data = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');

        let completed = 0;
        let total = 0; // rough proxy for total active on that day

        habits.forEach(h => {
            // For a perfect chart, we'd need to know if the habit was active on that day in the past.
            // But for simplicity, let's just count total logs vs completions today
            const logForDay = h.logs?.find(l => l.date === dateStr);
            if (logForDay) {
                total++;
                if (logForDay.status) {
                    completed++;
                }
            } else {
                // If no log exists but they created it before this date, it was active but incomplete
                // We'll skip deep historical tracking for custom days to keep it fast, 
                // just count overall if we see any logs in history or if it's new.
                // A better approach is simply mapping completions:
            }
        });

        // Simpler Metric: Just total completed habits per day
        let completionsCount = 0;
        habits.forEach(h => {
            if (h.logs?.some(l => l.date === dateStr && l.status)) {
                completionsCount++;
            }
        });

        return {
            name: format(date, 'EEE'),
            Completed: completionsCount
        };
    });

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 flex flex-col justify-center mb-8">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Past 7 Days Progress</h3>
            <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                        <YAxis hide />
                        <Tooltip
                            cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Bar
                            dataKey="Completed"
                            fill="url(#colorPurple)"
                            radius={[4, 4, 4, 4]}
                        />
                        <defs>
                            <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                                <stop offset="100%" stopColor="#EC4899" stopOpacity={1} />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CompletionChart;
