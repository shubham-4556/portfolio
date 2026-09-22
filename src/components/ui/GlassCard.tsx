// @ts-nocheck
'use client';

import {motion} from 'framer-motion';
import {forwardRef, HTMLAttributes, memo, ReactNode} from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'glow';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hoverable?: boolean;
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

const radiusStyles = {
  none: '',
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-2xl',
  xl: 'rounded-3xl',
  '2xl': 'rounded-4xl',
  full: 'rounded-full',
};

const variantStyles = {
  default: 'bg-white/5 backdrop-blur-xl border border-white/10',
  elevated: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50',
  outlined: 'bg-transparent backdrop-blur-xl border border-white/20',
  glow: 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(249,115,22,0.15)]',
};

const GlassCardInner = function GlassCardInner(
  {
    children,
    variant = 'default',
    padding = 'md',
    hoverable = false,
    borderRadius = 'lg',
    className = '',
    style,
    ...props
  }: GlassCardProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <motion.div
      animate={{opacity: 1, y: 0}}
      className={`
        ${variantStyles[variant]}
        ${paddingStyles[padding]}
        ${radiusStyles[borderRadius]}
        ${
          hoverable
            ? 'transition-all duration-500 hover:border-orange-500/50 hover:shadow-[0_0_60px_rgba(249,115,22,0.2)]'
            : ''
        }
        ${className}
      `}
      initial={{opacity: 0, y: 30}}
      ref={ref}
      style={style}
      transition={{duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275]}}
      whileHover={hoverable ? {y: -8, scale: 1.01} : undefined}
      {...props}>
      {children}
    </motion.div>
  );
};

export const GlassCard = memo(forwardRef(GlassCardInner));
GlassCard.displayName = 'GlassCard';
