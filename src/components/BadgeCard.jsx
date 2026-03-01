import React from 'react';
import { FaMedal, FaCrown, FaStar, FaFire } from 'react-icons/fa';

const iconMap = {
    fire: <FaFire className="text-orange-500 text-2xl" />,
    crown: <FaCrown className="text-yellow-500 text-2xl" />,
    star: <FaStar className="text-purple-500 text-2xl" />,
    medal: <FaMedal className="text-blue-500 text-2xl" />
};

const bgMap = {
    fire: 'bg-orange-50',
    crown: 'bg-yellow-50',
    star: 'bg-purple-50',
    medal: 'bg-blue-50'
};

const BadgeCard = ({ title, desc, icon }) => {
    return (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 hover:shadow-md">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgMap[icon] || 'bg-gray-50'}`}>
                {iconMap[icon] || iconMap.star}
            </div>
            <div>
                <h4 className="font-bold text-gray-800 text-sm leading-tight mb-0.5">{title}</h4>
                <p className="text-gray-500 text-xs">{desc}</p>
            </div>
        </div>
    );
};

export default BadgeCard;
