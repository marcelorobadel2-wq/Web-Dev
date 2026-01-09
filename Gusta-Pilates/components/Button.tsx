
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  fullWidth?: boolean;
  tooltip?: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  fullWidth = false,
  tooltip
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const baseStyle = "group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-accent text-white hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] focus:ring-brand-500 border border-white/10",
    secondary: "bg-white text-slate-900 hover:bg-slate-100 focus:ring-white",
    outline: "border-2 border-slate-700 text-slate-300 hover:border-brand-500 hover:text-white focus:ring-slate-500 bg-transparent"
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <div className="relative inline-block w-full sm:w-auto">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${widthClass} ${className}`}
      >
        {/* Button Glow Effect */}
        {variant === 'primary' && (
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
        )}
        
        <span className="relative flex items-center gap-2">
          <motion.span
            initial={false}
            className="inline-block"
          >
            {children}
          </motion.span>
          <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2 group-hover:scale-110" />
        </span>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-1/2 -translate-x-1/2 px-3 py-1.5 bg-brand-900 text-white text-xs font-bold rounded-lg border border-brand-500/30 whitespace-nowrap shadow-xl pointer-events-none z-50"
          >
            {tooltip}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-brand-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
