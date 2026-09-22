// @ts-nocheck
'use client';

import {motion} from 'framer-motion';
import {HTMLAttributes, memo, ReactNode} from 'react';

export interface AnimatedTextProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: 'fade' | 'slide' | 'scale' | 'rotate' | 'blur' | 'typewriter' | 'reveal';
  delay?: number;
  duration?: number;
  stagger?: number;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

const variantAnimations: Record<
  string,
  {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    transition: {duration: number; ease: string | number[]};
  }
> = {
  fade: {initial: {opacity: 0}, animate: {opacity: 1}, transition: {duration: 0.5, ease: 'easeOut'}},
  slide: {
    initial: {opacity: 0, y: 30},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  slideLeft: {
    initial: {opacity: 0, x: -30},
    animate: {opacity: 1, x: 0},
    transition: {duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  slideRight: {
    initial: {opacity: 0, x: 30},
    animate: {opacity: 1, x: 0},
    transition: {duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  scale: {
    initial: {opacity: 0, scale: 0.8},
    animate: {opacity: 1, scale: 1},
    transition: {duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  rotate: {
    initial: {opacity: 0, rotate: -90},
    animate: {opacity: 1, rotate: 0},
    transition: {duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  blur: {
    initial: {opacity: 0, filter: 'blur(20px)'},
    animate: {opacity: 1, filter: 'blur(0px)'},
    transition: {duration: 0.8, ease: 'easeOut'},
  },
  reveal: {
    initial: {opacity: 0, y: '100%'},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
};

const AnimatedTextInner = memo(function AnimatedTextInner({
  children,
  variant = 'slide',
  delay = 0,
  duration,
  stagger = 0,
  className = '',
  as: Component = 'span',
  ...props
}: AnimatedTextProps) {
  const animation = variantAnimations[variant] || variantAnimations.slide;
  const transition = {
    ...animation.transition,
    delay,
    duration: duration || animation.transition.duration,
  };

  if (typeof children === 'string' && stagger > 0) {
    const words = children.split(' ');
    return (
      <Component className={className} {...props}>
        {words.map((word, index) => (
          <motion.span
            animate={animation.animate}
            initial={animation.initial}
            key={index}
            style={{display: 'inline-block', marginRight: index < words.length - 1 ? '0.25em' : 0}}
            transition={{...transition, delay: delay + index * stagger}}>
            {word}
          </motion.span>
        ))}
      </Component>
    );
  }

  const Content = (
    <motion.span
      animate={animation.animate}
      initial={animation.initial}
      style={{display: 'inline-block', ...props.style}}
      transition={transition}>
      {children}
    </motion.span>
  );

  return <Component className={className} {...props}>{Content}</Component>;
});

export const AnimatedText = AnimatedTextInner;

const AnimatedHeadingInner = memo(function AnimatedHeadingInner({
  children,
  variant = 'slide',
  delay = 0,
  duration,
  stagger = 0.08,
  className = '',
  as: Component = 'h1',
  ...props
}: AnimatedTextProps) {
  return (
    <AnimatedText
      as={Component}
      className={className}
      delay={delay}
      duration={duration}
      stagger={stagger}
      variant={variant}
      {...props}>
      {children}
    </AnimatedText>
  );
});

export const AnimatedHeading = AnimatedHeadingInner;

export function GradientText({
  children,
  className = '',
  gradient = 'from-orange-500 via-orange-400 to-cyan-400',
  ...props
}: {
  children: ReactNode;
  className?: string;
  gradient?: string;
}) {
  return (
    <span className={`text-orange-400 ${className}`} {...props}>
      {children}
    </span>
  );
}

export function ShimmerText({
  children,
  className = '',
  _duration = 2,
  ...props
}: {
  children: ReactNode;
  className?: string;
  duration?: number;
}) {
  return (
    <span className={`text-orange-300 ${className}`} {...props}>
      {children}
    </span>
  );
}
