import React from 'react';
import { motion } from 'framer-motion';

const MoodBubble = ({ children, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg border-4 border-pink-200 ${className}`}
    >
      {/* Speech bubble tail */}
      <div
        className="absolute -bottom-3 left-8 w-0 h-0"
        style={{
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '12px solid white',
          filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
        }}
      />
      <div
        className="absolute -bottom-1 left-9 w-0 h-0"
        style={{
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderTop: '10px solid #fce7f3'
        }}
      />
      {/* Content */}
      <div className="relative z-10 text-gray-800">
        {children}
      </div>
    </motion.div>
  );
};

export default MoodBubble;