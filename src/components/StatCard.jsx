// src/components/StatCard.jsx
export default function StatCard({ title, value, subtitle, icon, trend }) {
    return (
        <div className="bg-gradient-to-br from-violet-800 to-violet-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="text-violet-300">
                    {icon}
                </div>
                {trend && (
                    <span className={`text-sm font-medium ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {trend.value}
                    </span>
                )}
            </div>
            <h3 className="text-white text-lg font-semibold mb-2">{title}</h3>
            <p className="text-3xl font-bold text-white mb-2">{value}</p>
            <p className="text-violet-300 text-sm">{subtitle}</p>
        </div>
    );
}
