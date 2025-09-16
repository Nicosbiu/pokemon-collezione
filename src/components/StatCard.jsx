// StatCard.jsx con tooltip integrato
import { useState } from 'react';

export default function StatCard({ title, value, subtitle, icon, trend }) {
    const [showTooltip, setShowTooltip] = useState(false);

    // Contenuto tooltip basato sul trend
    const getTooltipContent = () => {
        if (!trend) return null;

        if (trend.positive) {
            return {
                title: "Trend Positivo",
                description: "Le tue statistiche stanno migliorando! Continua così.",
                detail: trend.value
            };
        } else {
            return {
                title: "Trend Negativo",
                description: "C'è stata una diminuzione rispetto al periodo precedente.",
                detail: trend.value
            };
        }
    };

    const tooltipContent = getTooltipContent();

    return (
        <div className="group relative p-8 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:bg-white/8 will-change-transform min-h-48">

            {/* Top section - Icon e trend con tooltip */}
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/15 backdrop-blur-sm border border-white/15 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    {icon}
                </div>

                {trend && (
                    <div
                        className="relative group/tooltip"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                    >
                        {/* Area hover estesa sopra e sui lati del badge */}
                        <div className="absolute -top-4 -left-2 -right-2 h-6"></div>

                        {/* Trend badge */}
                        <div className={`relative text-xs px-3 py-2 rounded-full backdrop-blur-sm cursor-help transition-all duration-200 ${trend.positive
                                ? 'bg-green-500/15 text-green-300 border border-green-500/25 hover:bg-green-500/25'
                                : 'bg-red-500/15 text-red-300 border border-red-500/25 hover:bg-red-500/25'
                            }`}>
                            {trend.positive ? '↗' : '↘'}
                        </div>
                        {/* Tooltip Glass - CON BRIDGE per evitare flickering */}
                        <div className={`absolute top-full right-0 mt-1 transition-all duration-200 ${showTooltip ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                            }`}>

                            {/* Bridge invisibile per non perdere hover */}
                            <div className="absolute -top-2 left-0 w-full h-3"></div>

                            <div className="w-64 z-50">
                                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4 shadow-2xl shadow-black/20">

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none"></div>

                                    <div className="relative z-10">
                                        {/* Header tooltip */}
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className={`w-2 h-2 rounded-full ${trend.positive ? 'bg-green-400' : 'bg-red-400'
                                                }`}></div>
                                            <h4 className={`text-sm font-semibold ${trend.positive ? 'text-green-300' : 'text-red-300'
                                                }`}>
                                                {tooltipContent.title}
                                            </h4>
                                        </div>

                                        {/* Description */}
                                        <p className="text-xs text-white/80 mb-3 leading-relaxed">
                                            {tooltipContent.description}
                                        </p>

                                        {/* Detail */}
                                        <div className="px-3 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/10">
                                            <p className="text-xs text-white/70 font-mono">
                                                {tooltipContent.detail}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Arrow pointer - POSIZIONE CORRETTA */}
                                    <div className="absolute -top-1 right-6 w-2 h-2 bg-white/10 border-l border-t border-white/20 rotate-45 backdrop-blur-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Main value */}
            <div className="mb-4">
                <h3 className="text-4xl font-extralight text-white/95 leading-none tracking-tight">
                    {value}
                </h3>
            </div>

            {/* Bottom section */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-white/85">{title}</p>
                <p className="text-xs text-white/60 leading-relaxed">{subtitle}</p>
                {trend && (
                    <p className="text-xs text-white/50 mt-3">{trend.value}</p>
                )}
            </div>

            {/* Floating elements */}
            <div className="absolute top-4 right-6 w-8 h-8 bg-gradient-to-br from-purple-400/8 to-transparent rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-gradient-to-br from-pink-400/5 to-transparent rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        </div>
    );
}
