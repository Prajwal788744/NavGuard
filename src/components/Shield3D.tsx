import React from 'react';
import { motion } from 'framer-motion';

const Shield3D = () => (
  <div className="w-full h-[280px] md:h-[360px] flex items-center justify-center">
    <motion.div
      className="relative"
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      style={{ perspective: 800, transformStyle: "preserve-3d" }}
    >
      <svg width="160" height="200" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="shieldGrad" x1="50" y1="0" x2="50" y2="120" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B3060" />
            <stop offset="100%" stopColor="#071D35" />
          </linearGradient>
          <linearGradient id="pinGrad" x1="50" y1="40" x2="50" y2="75" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#00D48C" />
            <stop offset="100%" stopColor="#009E65" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Shield */}
        <path d="M50 5 L90 22 L90 58 C90 80 72 95 50 103 C28 95 10 80 10 58 L10 22 Z" fill="url(#shieldGrad)" />
        <path d="M50 5 L90 22 L90 58 C90 80 72 95 50 103 C28 95 10 80 10 58 L10 22 Z" fill="none" stroke="#00B87A" strokeWidth="2" strokeOpacity="0.8" filter="url(#glow)" />
        {/* Pin */}
        <path d="M50 40 C42 40 35.5 46.5 35.5 54.5 C35.5 65 50 80 50 80 C50 80 64.5 65 64.5 54.5 C64.5 46.5 58 40 50 40 Z" fill="white" opacity="0.95" />
        <circle cx="50" cy="54.5" r="8" fill="url(#pinGrad)" />
        <circle cx="50" cy="54.5" r="3" fill="white" />
      </svg>
      {/* Glow rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-guard-green/30"
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ borderRadius: '50%' }}
      />
    </motion.div>
  </div>
);

export default Shield3D;
