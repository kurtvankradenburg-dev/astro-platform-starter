import React from "react";

interface CircularGaugeProps {
    score: number;
    maxScore: number;
    label: string;
    size?: number;
    strokeWidth?: number;
    analysis?: string;
    locked?: boolean;
}

function getColor(score: number, max: number): string {
    const ratio = score / max;
    if (ratio >= 0.7) return "#22c55e";
    if (ratio >= 0.4) return "#00d4ff";
    return "#ef4444";
}

function getTrackColor(score: number, max: number): string {
    const ratio = score / max;
    if (ratio >= 0.7) return "rgba(34, 197, 94, 0.1)";
    if (ratio >= 0.4) return "rgba(0, 212, 255, 0.1)";
    return "rgba(239, 68, 68, 0.1)";
}

export default function CircularGauge({ score, maxScore, label, size = 120, strokeWidth = 8, analysis, locked = false }: CircularGaugeProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = locked ? 0 : (score / maxScore) * circumference;
    const color = locked ? "#1e293b" : getColor(score, maxScore);
    const trackColor = locked ? "rgba(30, 41, 59, 0.15)" : getTrackColor(score, maxScore);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={trackColor}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - progress}
                        style={{ transition: "stroke-dashoffset 1s ease-out" }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {locked ? (
                        <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    ) : (
                        <>
                            <span className="text-2xl font-bold" style={{ color }}>{score}</span>
                            <span className="text-xs text-gray-600">/ {maxScore}</span>
                        </>
                    )}
                </div>
            </div>
            <span className="text-xs font-medium text-gray-500 text-center max-w-[100px]">{label}</span>
            {analysis && !locked && (
                <p className="text-xs text-gray-600 text-center max-w-[140px] leading-relaxed">{analysis}</p>
            )}
        </div>
    );
}
