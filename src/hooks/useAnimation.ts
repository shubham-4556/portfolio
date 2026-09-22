import {useMotionValue, useSpring, useTransform} from 'framer-motion';
import {useEffect, useState} from 'react';

export function useScrollY() {
  const scrollY = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollY.set(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollY]);

  return scrollY;
}

export function useScrollProgress() {
  const scrollY = useScrollY();
  const progress = useTransform(scrollY, [0, 1000], [0, 1]);
  return progress;
}

export function useInView(ref: React.RefObject<HTMLElement>, options = {}) {
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
        ...options,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, options]);

  return isInView;
}

export function useParallax(speed = 0.5) {
  const scrollY = useScrollY();
  const y = useTransform(scrollY, [0, 1000], [0, -1000 * speed]);
  return y;
}

export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({x: 0, y: 0});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({x: e.clientX, y: e.clientY});
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
}

export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

export function useSpringValue(value: number, config = {stiffness: 300, damping: 30}) {
  const motionValue = useMotionValue(value);
  const springValue = useSpring(motionValue, config);
  return [motionValue, springValue] as const;
}

export function useCounter(end: number, duration = 2000, start = 0) {
  const [count, setCount] = useState(start);
  const [isActive, setIsActive] = useState(false);

  const startCounting = () => {
    if (isActive) return;
    setIsActive(true);

    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);

      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsActive(false);
      }
    };

    requestAnimationFrame(animate);
  };

  return {count, startCounting, isActive};
}

export function useStaggeredAnimation(delay = 0.1) {
  const [items, setItems] = useState<number[]>([]);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  const registerItem = () => {
    const id = items.length;
    setItems(prev => [...prev, id]);
    return id;
  };

  const triggerItem = (id: number) => {
    setTimeout(
      () => {
        setVisibleItems(prev => new Set([...prev, id]));
      },
      id * delay * 1000,
    );
  };

  const triggerAll = () => {
    items.forEach((_, index) => {
      setTimeout(
        () => {
          setVisibleItems(prev => new Set([...prev, index]));
        },
        index * delay * 1000,
      );
    });
  };

  return {registerItem, triggerItem, triggerAll, visibleItems};
}
