// @ts-nocheck
'use client';

import {ArrowDownTrayIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import {
  motion,
  MotionConfig,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {FC, memo, useCallback, useMemo, useRef} from 'react';

import {heroData, SectionId} from '../../data/data';
import Socials from '../Socials';
import {MagneticButton} from '../ui/MagneticButton';

const ROLE = 'Full Stack Developer';

const FADE_DELAY = {opacity: 0, y: 28};
const FADE_SHOW = {opacity: 1, y: 0};
const VELOCITY_STIFFNESS = 80;
const VELOCITY_DAMPING = 18;

const floatEase = [0.175, 0.885, 0.32, 1.275];

const techCards = [
  {label: 'React', dot: 'bg-cyan-400', pos: '-left-3 top-8 sm:-left-8 sm:top-10', duration: 6, delay: 0.2},
  {label: 'Next.js', dot: 'bg-white', pos: '-right-3 top-4 sm:-right-10 sm:top-6', duration: 5, delay: 0.7},
  {label: 'Node.js', dot: 'bg-green-400', pos: '-left-4 bottom-20 sm:-left-12 sm:bottom-24', duration: 7, delay: 1.1},
  {
    label: 'TypeScript',
    dot: 'bg-blue-400',
    pos: '-right-4 bottom-14 sm:-right-8 sm:bottom-16',
    duration: 6.5,
    delay: 0.5,
  },
  {label: 'PostgreSQL', dot: 'bg-sky-400', pos: 'left-10 -top-6 sm:left-8 sm:-top-7', duration: 5.5, delay: 0.9},
  {label: 'AI/ML', dot: 'bg-fuchsia-400', pos: 'right-10 -bottom-8 sm:-bottom-9', duration: 6, delay: 1.4},
] as const;

const particles = [
  {top: '20%', left: '14%', size: 3, duration: 7},
  {top: '30%', right: '20%', size: 2, duration: 9},
  {bottom: '26%', left: '22%', size: 2, duration: 8},
  {top: '64%', left: '9%', size: 3, duration: 10},
  {bottom: '34%', right: '12%', size: 2, duration: 6.5},
] as const;

const Hero: FC = memo(() => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const {scrollYProgress} = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const contentScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.96]);
  const indicatorOpacity = useTransform(scrollYProgress, [0.2, 0.5], [1, 0]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, {stiffness: VELOCITY_STIFFNESS, damping: VELOCITY_DAMPING});
  const springY = useSpring(mouseY, {stiffness: VELOCITY_STIFFNESS, damping: VELOCITY_DAMPING});

  const profileX = useTransform(springX, value => value * 14);
  const profileY = useTransform(springY, value => value * 14);
  const cardsX = useTransform(springX, value => value * -22);
  const cardsY = useTransform(springY, value => value * -22);
  const glowX = useTransform(springX, value => value * -30);
  const glowY = useTransform(springY, value => value * -30);

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const bounds = event.currentTarget.getBoundingClientRect();
      mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
      mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    },
    [mouseX, mouseY],
  );

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const {actions, description, imageSrc} = heroData;
  const primaryAction = actions.find(action => action.primary) ?? actions[0];
  const workIcon = useMemo(() => <ArrowRightIcon className="h-4 w-4" />, []);
  const downloadIcon = useMemo(() => <ArrowDownTrayIcon className="h-4 w-4" />, []);

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#050505]"
      id={SectionId.Hero}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={sectionRef}>
      <MotionConfig reducedMotion="user">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[34rem] w-[34rem] rounded-full bg-orange-500/[0.07] blur-3xl" />
          <div className="absolute -bottom-40 -right-32 h-[38rem] w-[38rem] rounded-full bg-cyan-500/[0.06] blur-3xl" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/[0.05] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />
        </div>

        {/* Particles */}
        {!reduceMotion && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {particles.map((particle, index) => (
              <motion.span
                animate={{opacity: [0, 0.7, 0], y: [-8, 8, -8]}}
                className="absolute rounded-full bg-orange-300/60 shadow-[0_0_8px_rgba(251,146,60,0.5)]"
                key={index}
                style={{
                  height: particle.size,
                  left: particle.left,
                  right: particle.right,
                  top: particle.top,
                  width: particle.size,
                }}
                transition={{duration: particle.duration, ease: 'easeInOut', repeat: Infinity}}
              />
            ))}
          </div>
        )}

        {/* Content */}
        <motion.div
          className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-28 lg:px-8 lg:pt-32"
          style={{opacity: contentOpacity, scale: contentScale}}>
          <div className="grid grid-cols-1 items-center gap-y-14 sm:gap-y-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-16 xl:gap-x-24">
            {/* Left column */}
            <div className="flex min-w-0 flex-col items-start">
              <motion.span
                animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-neutral-300 backdrop-blur-md"
                initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 0.1, duration: 0.6, ease: floatEase}}>
                <motion.span
                  animate={reduceMotion ? undefined : {opacity: [1, 0.3, 1]}}
                  aria-hidden="true"
                  className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </motion.span>
                Available for new projects
              </motion.span>

              <motion.p
                animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-8 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-orange-400"
                initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 0.2, duration: 0.6, ease: floatEase}}>
                Hi, I&apos;m
              </motion.p>

              <motion.h1
                animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl"
                initial={reduceMotion ? {opacity: 0} : FADE_DELAY}
                transition={{delay: 0.3, duration: 0.7, ease: floatEase}}>
                Shubham Deo
              </motion.h1>

              <motion.h2
                animate={
                  reduceMotion
                    ? {opacity: 1}
                    : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y, backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']}
                }
                className="mt-3 bg-[linear-gradient(90deg,#f97316,#fbbf24,#06b6d4,#f97316)] bg-clip-text bg-[length:220%_auto] text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl xl:text-5xl"
                initial={reduceMotion ? {opacity: 0} : {opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 0.4, duration: 0.7, ease: floatEase}}>
                {ROLE}
              </motion.h2>

              <motion.div
                animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-6 max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg"
                initial={reduceMotion ? {opacity: 0} : FADE_DELAY}
                transition={{delay: 0.55, duration: 0.7, ease: floatEase}}>
                {description}
              </motion.div>

              <motion.div
                animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
                initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 0.7, duration: 0.6, ease: floatEase}}>
                <MagneticButton
                  className="w-full justify-center sm:w-auto"
                  href={primaryAction.href}
                  icon={workIcon}
                  iconPosition="right"
                  variant="primary">
                  {primaryAction.text}
                </MagneticButton>
                <MagneticButton
                  className="w-full justify-center sm:w-auto"
                  download={actions[1]?.download}
                  href={actions[1].href}
                  icon={downloadIcon}
                  iconPosition="right"
                  variant="outline">
                  {actions[1].text}
                </MagneticButton>
              </motion.div>

              <motion.div
                animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-8"
                initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 0.85, duration: 0.6, ease: floatEase}}>
                <Link
                  className="group inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition-colors duration-300 hover:text-orange-400"
                  href={`#${SectionId.Contact}`}>
                  Let&apos;s Work Together
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>

              <motion.div
                animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
                className="mt-10"
                initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
                transition={{delay: 1, duration: 0.6, ease: floatEase}}>
                <Socials />
              </motion.div>
            </div>

            {/* Right column — profile visual */}
            <motion.div
              animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, scale: 1, y: FADE_SHOW.y}}
              className="relative mx-auto w-fit"
              initial={reduceMotion ? {opacity: 0} : {opacity: FADE_DELAY.opacity, scale: 0.9, y: FADE_DELAY.y}}
              transition={{delay: 0.45, duration: 0.9, ease: floatEase}}>
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{x: glowX, y: glowY}}>
                <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.16),transparent_70%)] blur-2xl" />
              </motion.div>

              {/* Orbital rings */}
              {!reduceMotion && (
                <>
                  <motion.div
                    animate={{rotate: 360}}
                    aria-hidden="true"
                    className="absolute -inset-8 rounded-full border border-dashed border-white/10 sm:-inset-14"
                    transition={{duration: 50, ease: 'linear', repeat: Infinity}}
                  />
                  <motion.div
                    animate={{rotate: 360}}
                    aria-hidden="true"
                    className="absolute -inset-4 rounded-full border border-white/[0.06] sm:-inset-8"
                    transition={{duration: 28, ease: 'linear', repeat: Infinity}}>
                    <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.9)]" />
                    <span className="absolute bottom-0 left-1/2 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_10px_rgba(251,146,60,0.9)]" />
                  </motion.div>
                </>
              )}

              {/* Floating tech cards */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{x: cardsX, y: cardsY}}>
                {techCards.map((card, index) => (
                  <motion.span
                    animate={reduceMotion ? undefined : {y: [0, -8, 0]}}
                    className={`absolute ${card.pos} inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-3 py-1.5 text-[11px] font-semibold text-neutral-200 shadow-lg shadow-black/40 backdrop-blur-md`}
                    key={index}
                    transition={{duration: card.duration, delay: card.delay, ease: 'easeInOut', repeat: Infinity}}>
                    <span className={`h-1.5 w-1.5 rounded-full ${card.dot}`} />
                    {card.label}
                  </motion.span>
                ))}
              </motion.div>

              {/* Animated gradient portrait */}
              <motion.div
                className="group relative overflow-hidden rounded-full bg-[#080808] p-[3px] shadow-[0_0_80px_-20px_rgba(249,115,22,0.45)]"
                style={{x: profileX, y: profileY}}>
                {!reduceMotion && (
                  <motion.div
                    animate={{rotate: 360}}
                    aria-hidden="true"
                    className="absolute -inset-[22%] rounded-full bg-[conic-gradient(from_0deg,#f97316,#fbbf24,#06b6d4,#f97316)]"
                    transition={{duration: 14, ease: 'linear', repeat: Infinity}}
                  />
                )}
                <motion.div
                  animate={reduceMotion ? undefined : {y: [0, -10, 0]}}
                  className="relative aspect-square w-56 overflow-hidden rounded-full sm:w-72 lg:w-80"
                  transition={{duration: 7, ease: 'easeInOut', repeat: Infinity}}>
                  <Image
                    alt="Portrait of Shubham Deo"
                    className="h-full w-full object-cover"
                    height={1448}
                    priority
                    src={imageSrc}
                    width={1086}
                  />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10 transition-transform duration-500 group-hover:scale-105" />
                </motion.div>
              </motion.div>

              {/* Status pill */}
              <motion.div
                animate={reduceMotion ? undefined : {y: [0, -6, 0]}}
                className="absolute -bottom-3 left-6 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur-md"
                transition={{duration: 5, delay: 1.2, ease: 'easeInOut', repeat: Infinity}}>
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Open to work
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{opacity: 1}}
          className="absolute bottom-6 left-1/2 z-10"
          initial={{opacity: 0}}
          style={{x: '-50%'}}
          transition={{delay: 1.4, duration: 0.8}}
          whileHover={{y: 4}}>
          <motion.a
            animate={reduceMotion ? undefined : {y: [0, 6, 0]}}
            className="flex flex-col items-center gap-2 text-neutral-500 transition-colors duration-300 hover:text-orange-400"
            href={`#${SectionId.About}`}
            style={{opacity: indicatorOpacity}}
            transition={{duration: 1.8, ease: 'easeInOut', repeat: Infinity}}>
            <span className="text-[10px] uppercase tracking-[0.3em]">Scroll to explore</span>
            <span aria-hidden="true" className="text-lg">
              ↓
            </span>
          </motion.a>
        </motion.div>
      </MotionConfig>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
