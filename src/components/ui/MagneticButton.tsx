// @ts-nocheck
'use client';

import {motion, useMotionValue} from 'framer-motion';
import {forwardRef, memo, ReactNode, useEffect, useImperativeHandle, useRef, useState} from 'react';

export interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  href?: string;
  target?: string;
  rel?: string;
}

const variantStyles = {
  primary:
    'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/25',
  secondary:
    'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:from-cyan-600 hover:to-cyan-700 shadow-lg shadow-cyan-500/25',
  outline: 'border-2 border-orange-500 text-orange-500 bg-transparent hover:bg-orange-500/10',
  ghost: 'text-orange-500 bg-transparent hover:bg-orange-500/10',
};

const sizeStyles = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

const MagneticButtonInner = function MagneticButtonInner(
  {
    children,
    strength = 30,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    icon,
    iconPosition = 'left',
    className = '',
    style,
    disabled,
    onClick,
    href,
    target,
    rel,
  }: MagneticButtonProps,
  ref: React.Ref<HTMLButtonElement>,
) {
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [mousePos, setMousePos] = useState({x: 0, y: 0});
  const [isHovered, setIsHovered] = useState(false);

  useImperativeHandle(ref, () => ({
    focus: () => buttonRef.current?.focus(),
    blur: () => buttonRef.current?.blur(),
    click: () => buttonRef.current?.click(),
  }));

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    if (disabled || loading) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setMousePos({x, y});
  };

  const handleMouseLeave = () => {
    setMousePos({x: 0, y: 0});
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeaveButton = () => {
    setIsHovered(false);
  };

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  useEffect(() => {
    const animate = () => {
      x.set(mousePos.x * (strength / 100));
      y.set(mousePos.y * (strength / 100));
      rotateX.set(-mousePos.y * 0.05);
      rotateY.set(mousePos.x * 0.05);
      requestAnimationFrame(animate);
    };
    animate();
  }, [mousePos, strength, x, y, rotateX, rotateY]);

  useEffect(() => {
    if (isHovered) {
      scale.set(1.02);
    } else {
      scale.set(1);
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    }
  }, [isHovered, scale, x, y, rotateX, rotateY]);

  const isLink = href && href.length > 0;

  const baseStyle = {
    ...style,
    transform: `translate3d(${x.get()}px, ${y.get()}px, 0) scale(${scale.get()}) rotateX(${rotateX.get()}deg) rotateY(${rotateY.get()}deg)`,
  };

  const classNameString = `
    relative inline-flex items-center justify-center gap-2 font-semibold rounded-xl
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  const commonProps = {
    ref: buttonRef,
    style: baseStyle,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    onMouseLeaveCapture: handleMouseLeaveButton,
    onClick,
    className: classNameString,
    whileTap: {scale: 0.98},
  };

  const buttonContent = (
    <>
      {loading ? (
        <>
          <motion.span
            animate={{rotate: 360}}
            className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
            transition={{duration: 1, repeat: Infinity, ease: 'linear'}}
          />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex items-center">{icon}</span>}
          <span className="relative z-10">{children}</span>
          {icon && iconPosition === 'right' && <span className="flex items-center">{icon}</span>}
        </>
      )}
      <motion.span
        animate={{opacity: isHovered ? 1 : 0}}
        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl opacity-0"
        transition={{duration: 0.3}}
      />
    </>
  );

  if (isLink) {
    return (
      <motion.a
        {...commonProps}
        href={href}
        rel={rel || (target === '_blank' ? 'noopener noreferrer' : undefined)}
        target={target}>
        {buttonContent}
      </motion.a>
    );
  }

  return (
    <motion.button {...commonProps} disabled={disabled || loading}>
      {buttonContent}
    </motion.button>
  );
};

export const MagneticButton = memo(forwardRef(MagneticButtonInner));
MagneticButton.displayName = 'MagneticButton';
