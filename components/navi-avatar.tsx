'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface NaviAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

export function NaviAvatar({ size = 'md', animate = true, className = '' }: NaviAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className}`}
      animate={animate ? {
        scale: [1, 1.05, 1],
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-50 blur-md"
        animate={animate ? {
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main avatar circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-lg">
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50 blur-sm" />

        {/* Navi icon */}
        <Sparkles className={`${iconSizes[size]} text-white relative z-10`} strokeWidth={2.5} />

        {/* Animated particles */}
        {animate && (
          <>
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: '20%', right: '20%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0,
              }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ bottom: '25%', left: '25%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{ top: '30%', left: '15%' }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: 1,
              }}
            />
          </>
        )}
      </div>

      {/* Pulse ring */}
      {animate && (
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-purple-400"
          animate={{
            scale: [1, 1.4],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
      )}
    </motion.div>
  );
}

// Static version without framer-motion for places where animation is not needed
export function NaviAvatarStatic({ size = 'md', className = '' }: Omit<NaviAvatarProps, 'animate'>) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-40 blur-md" />

      {/* Main avatar circle */}
      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-lg">
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 opacity-50 blur-sm" />

        {/* Navi icon */}
        <Sparkles className={`${iconSizes[size]} text-white relative z-10`} strokeWidth={2.5} />
      </div>
    </div>
  );
}
