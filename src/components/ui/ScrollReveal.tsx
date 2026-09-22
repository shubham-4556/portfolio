// @ts-nocheck
'use client';

import {motion, useInView, useMotionValue, useTransform} from 'framer-motion';
import {forwardRef, HTMLAttributes, memo, ReactNode, useCallback, useEffect, useRef, useState} from 'react';

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?:
    'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate' | 'blur' | 'flip' | 'reveal';
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: 'div' | 'section' | 'article' | 'aside';
}

const variantAnimations: Record<
  string,
  {
    initial: Record<string, unknown>;
    animate: Record<string, unknown>;
    transition: {duration: number; ease: string | number[]};
  }
> = {
  fade: {initial: {opacity: 0}, animate: {opacity: 1}, transition: {duration: 0.6, ease: 'easeOut'}},
  slideUp: {
    initial: {opacity: 0, y: 60},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  slideDown: {
    initial: {opacity: 0, y: -60},
    animate: {opacity: 1, y: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  slideLeft: {
    initial: {opacity: 0, x: -60},
    animate: {opacity: 1, x: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  slideRight: {
    initial: {opacity: 0, x: 60},
    animate: {opacity: 1, x: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  scale: {
    initial: {opacity: 0, scale: 0.8},
    animate: {opacity: 1, scale: 1},
    transition: {duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  rotate: {
    initial: {opacity: 0, rotate: -15},
    animate: {opacity: 1, rotate: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  blur: {
    initial: {opacity: 0, filter: 'blur(20px)'},
    animate: {opacity: 1, filter: 'blur(0px)'},
    transition: {duration: 0.8, ease: 'easeOut'},
  },
  flip: {
    initial: {opacity: 0, rotateX: -90},
    animate: {opacity: 1, rotateX: 0},
    transition: {duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]},
  },
  reveal: {
    initial: {opacity: 0, y: '100%'},
    animate: {opacity: 1, y: 0},
    transition: {duration: 1, ease: [0.175, 0.885, 0.32, 1.275]},
  },
};

const ScrollRevealInner = function ScrollRevealInner(
  {
    children,
    variant = 'slideUp',
    delay = 0,
    duration,
    once = true,
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    className = '',
    as: Component = 'div',
    style,
    ...props
  }: ScrollRevealProps,
  ref: React.Ref<HTMLDivElement>,
) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(elementRef, {once, amount: threshold, margin: rootMargin});

  const animation = variantAnimations[variant];
  const transition = duration ? {...animation.transition, duration} : animation.transition;

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      elementRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref && typeof ref === 'object') ref.current = el;
    },
    [ref],
  );

  return (
    <Component className={className} ref={setRef} style={style} {...props}>
      <motion.div
        animate={isInView ? animation.animate : animation.initial}
        initial={animation.initial}
        transition={{...transition, delay}}>
        {children}
      </motion.div>
    </Component>
  );
};

export const ScrollReveal = memo(forwardRef(ScrollRevealInner));
ScrollReveal.displayName = 'ScrollReveal';

export function StaggerContainer({
  children,
  stagger = 0.1,
  delay = 0,
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  as: _Component = 'div',
  ...props
}: {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  return (
    <div className={className} {...props}>
      {typeof children === 'function' ? children({stagger, delay}) : children}
    </div>
  );
}

export function StaggerItem({
  children,
  index,
  stagger = 0.1,
  delay = 0,
  variant = 'slideUp',
  duration,
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  as: _Component = 'div',
  ...props
}: {
  children: ReactNode;
  index: number;
  stagger?: number;
  delay?: number;
  variant?: keyof typeof variantAnimations;
  duration?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const animation = variantAnimations[variant];
  const transition = duration ? {...animation.transition, duration} : animation.transition;

  return (
    <motion.div
      animate={animation.animate}
      className={className}
      initial={animation.initial}
      transition={{...transition, delay: delay + index * stagger}}
      {...props}>
      {children}
    </motion.div>
  );
}

export function ParallaxScroll({
  children,
  speed = 0.5,
  className = '',
  style,
  ...props
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollYMotion = useMotionValue(scrollY);
  const y = useTransform(scrollYMotion, [0, window.innerHeight * 2], [0, -window.innerHeight * speed]);

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        transform: `translate3d(0, ${y.get()}px, 0)`,
      }}
      {...props}>
      {children}
    </motion.div>
  );
}
