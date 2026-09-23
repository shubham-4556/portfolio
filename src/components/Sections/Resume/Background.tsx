import {motion, useReducedMotion, useScroll, useTransform} from 'framer-motion';
import {FC, memo, useRef} from 'react';

const Background: FC = memo(() => {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const {scrollYProgress} = useScroll({target: ref, offset: ['start end', 'end start']});
  const yOrbPrimary = useTransform(scrollYProgress, [0, 1], [-40, 80]);
  const yOrbSecondary = useTransform(scrollYProgress, [0, 1], [60, -50]);
  const yOrbTertiary = useTransform(scrollYProgress, [0, 1], [20, 40]);
  const yLines = useTransform(scrollYProgress, [0, 1], [-30, 110]);

  const float = (duration: number, delay = 0) =>
    shouldReduceMotion
      ? undefined
      : {
          animate: {scale: [1, 1.15, 1], x: [0, 24, -14, 0]},
          transition: {duration, delay, repeat: Infinity, ease: 'easeInOut' as const},
        };

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      initial={{opacity: 0}}
      ref={ref}
      transition={{duration: 0.9, ease: 'easeOut'}}
      viewport={{once: true, margin: '-100px'}}
      whileInView={{opacity: 1}}>
      {/* Soft radial glow base */}
      <div className="absolute inset-0" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />

      {/* Floating gradient orbs (different speeds for depth) */}
      <motion.div
        className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl sm:h-[26rem] sm:w-[26rem]"
        style={{y: yOrbPrimary}}
        {...float(14, 0)}
      />
      <motion.div
        className="absolute -bottom-28 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl sm:h-[30rem] sm:w-[30rem]"
        style={{y: yOrbSecondary}}
        {...float(18, 2)}
      />
      <motion.div
        className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-orange-300/10 blur-3xl sm:h-80 sm:w-80"
        style={{y: yOrbTertiary}}
        {...float(16, 1)}
      />

      {/* Pulsing glow */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(249,115,22,0.12),transparent_70%)] blur-2xl"
        {...(shouldReduceMotion
          ? undefined
          : {
              animate: {opacity: [0.4, 0.7, 0.4], scale: [0.9, 1.1, 0.9]},
              transition: {duration: 9, repeat: Infinity, ease: 'easeInOut' as const},
            })}
      />

      {/* Abstract flowing lines */}
      <motion.div className="absolute inset-0 opacity-60" style={{y: yLines}}>
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 600"
          xmlns="http://www.w3.org/2000/svg">
          <motion.path
            animate={shouldReduceMotion ? undefined : {strokeDashoffset: -1600}}
            d="M -60 90 C 340 210, 520 -20, 820 130 S 1240 320, 1500 200"
            fill="none"
            initial={{strokeDashoffset: 0}}
            stroke="url(#resumeLineA)"
            strokeDasharray="8 18"
            strokeLinecap="round"
            strokeWidth="2"
            transition={shouldReduceMotion ? {duration: 0} : {duration: 46, repeat: Infinity, ease: 'linear'}}
          />
          <motion.path
            animate={shouldReduceMotion ? undefined : {strokeDashoffset: -1400}}
            d="M -60 470 C 360 340, 680 560, 1020 460 S 1420 380, 1540 430"
            fill="none"
            initial={{strokeDashoffset: -400}}
            stroke="url(#resumeLineB)"
            strokeDasharray="6 16"
            strokeLinecap="round"
            strokeWidth="1.5"
            transition={shouldReduceMotion ? {duration: 0} : {duration: 60, repeat: Infinity, ease: 'linear'}}
          />
          <defs>
            <linearGradient gradientUnits="userSpaceOnUse" id="resumeLineA" x1="0" x2="1440" y1="0" y2="0">
              <stop stopColor="#f97316" stopOpacity="0.28" />
              <stop offset="0.5" stopColor="#fb923c" stopOpacity="0.12" />
              <stop offset="1" stopColor="#06b6d4" stopOpacity="0.28" />
            </linearGradient>
            <linearGradient gradientUnits="userSpaceOnUse" id="resumeLineB" x1="0" x2="1440" y1="0" y2="0">
              <stop stopColor="#06b6d4" stopOpacity="0.28" />
              <stop offset="0.6" stopColor="#0ea5e9" stopOpacity="0.1" />
              <stop offset="1" stopColor="#f97316" stopOpacity="0.24" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </motion.div>
  );
});

Background.displayName = 'Background';
export default Background;
