import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const HeartSaveButton = ({ isSaved = false, onToggle, onDownload, size = 'medium', post }) => {
  const sizes = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const handleClick = () => {
    if (isSaved && onDownload && post) {
      onDownload(post);
    } else {
      onToggle();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`${sizes[size]} relative flex items-center justify-center rounded-full border-4 border-white shadow-lg hover:shadow-xl transition-all`}
      style={{
        background: isSaved
          ? 'radial-gradient(circle, #ff69b4 0%, #ec4899 50%, #db2777 100%)'
          : 'radial-gradient(circle, #fce7f3 0%, #fbcfe8 50%, #f9a8d4 100%)',
        filter: isSaved
          ? 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.8)) drop-shadow(0 0 16px rgba(236, 72, 153, 0.6)) drop-shadow(0 0 24px rgba(236, 72, 153, 0.4))'
          : 'drop-shadow(0 0 4px rgba(236, 72, 153, 0.4))',
        animation: isSaved ? 'pulse-glow 2s ease-in-out infinite' : 'none'
      }}
      title={isSaved ? "Download saved post" : "Save post"}
    >
      {isSaved && onDownload && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 border-2 border-pink-400 shadow-md"
        >
          <Download size={12} className="text-pink-500" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default HeartSaveButton;