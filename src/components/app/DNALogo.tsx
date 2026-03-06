import React from "react";

interface DNALogoProps {
    size?: number;
    className?: string;
}

export default function DNALogo({ size = 32, className = "" }: DNALogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <defs>
                <linearGradient id="dna-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00bce6" />
                    <stop offset="50%" stopColor="#00d4ff" />
                    <stop offset="100%" stopColor="#33e0ff" />
                </linearGradient>
            </defs>
            {/* DNA Strand 1 */}
            <path
                d="M13 4 C13 4, 27 9, 27 15 C27 21, 13 21, 13 27 C13 33, 27 33, 27 36"
                stroke="url(#dna-grad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
            />
            {/* DNA Strand 2 */}
            <path
                d="M27 4 C27 4, 13 9, 13 15 C13 21, 27 21, 27 27 C27 33, 13 33, 13 36"
                stroke="#33e0ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.5"
            />
            {/* Base pairs */}
            <line x1="15" y1="9.5" x2="25" y2="9.5" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <line x1="14" y1="15" x2="26" y2="15" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <line x1="14" y1="21" x2="26" y2="21" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <line x1="14" y1="27" x2="26" y2="27" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            <line x1="15" y1="32.5" x2="25" y2="32.5" stroke="#00d4ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
            {/* Glow dots at nodes */}
            <circle cx="13" cy="4" r="2" fill="#00d4ff" opacity="0.6" />
            <circle cx="27" cy="4" r="2" fill="#33e0ff" opacity="0.4" />
            <circle cx="27" cy="36" r="2" fill="#00d4ff" opacity="0.6" />
            <circle cx="13" cy="36" r="2" fill="#33e0ff" opacity="0.4" />
        </svg>
    );
}
