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
import {FC, memo, useCallback, useMemo, useRef, useState} from 'react';

import {heroData, SectionId} from '../../data/data';
import Socials from '../Socials';
import {MagneticButton} from '../ui/MagneticButton';

const ROLE = 'Full Stack Developer';

const FADE_DELAY = {opacity: 0, y: 28};
const FADE_SHOW = {opacity: 1, y: 0};
const VELOCITY_STIFFNESS = 80;
const VELOCITY_DAMPING = 18;

const floatEase: [number, number, number, number] = [0.175, 0.885, 0.32, 1.275];

const techCards = [
  {label: 'React', dot: 'bg-cyan-400', pos: '-left-3 top-8 lg:-left-8 lg:top-10', duration: 6, delay: 0.2},
  {label: 'Next.js', dot: 'bg-white', pos: '-right-3 top-4 lg:-right-10 lg:top-6', duration: 5, delay: 0.7},
  {label: 'Node.js', dot: 'bg-green-400', pos: '-left-4 bottom-20 lg:-left-12 lg:bottom-24', duration: 7, delay: 1.1},
  {
    label: 'TypeScript',
    dot: 'bg-blue-400',
    pos: '-right-4 bottom-14 lg:-right-8 lg:bottom-16',
    duration: 6.5,
    delay: 0.5,
    desktopOnly: true,
  },
  {
    label: 'PostgreSQL',
    dot: 'bg-sky-400',
    pos: 'left-10 -top-6 lg:left-8 lg:-top-7',
    duration: 5.5,
    delay: 0.9,
    desktopOnly: true,
  },
  {
    label: 'AI/ML',
    dot: 'bg-fuchsia-400',
    pos: 'right-10 -bottom-8 lg:-bottom-9',
    duration: 6,
    delay: 1.4,
    desktopOnly: true,
  },
] as const;

const particles = [
  {top: '20%', left: '14%', size: 3, duration: 7},
  {top: '30%', right: '20%', size: 2, duration: 9},
  {bottom: '26%', left: '22%', size: 2, duration: 8},
  {top: '64%', left: '9%', size: 3, duration: 10, desktopOnly: true},
  {bottom: '34%', right: '12%', size: 2, duration: 6.5, desktopOnly: true},
] as const;

const Hero: FC = memo(() => {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [isFinePointer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  );

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
      if (!isFinePointer) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      mouseX.set((event.clientX - bounds.left) / bounds.width - 0.5);
      mouseY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    },
    [isFinePointer, mouseX, mouseY],
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
      className="relative flex min-h-[100svh] items-center overflow-x-clip bg-[#050505]"
      id={SectionId.Hero}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={sectionRef}>
      <MotionConfig reducedMotion="user">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-orange-500/[0.08] opacity-60 blur-3xl lg:h-[34rem] lg:w-[34rem] lg:opacity-100" />
          <div className="absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.07] opacity-60 blur-3xl lg:h-[38rem] lg:w-[38rem] lg:opacity-100" />
          <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-amber-400/[0.05] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)] lg:opacity-100" />
        </div>

        {/* Particles */}
        {!reduceMotion && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            {particles.map((particle, index) => (
              <motion.span
                animate={{opacity: [0, 0.7, 0], y: [-8, 8, -8]}}
                className={`absolute rounded-full bg-orange-300/60 shadow-[0_0_8px_rgba(251,146,60,0.5)] ${
                  particle.desktopOnly ? 'hidden lg:block' : ''
                }`}
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
          className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-[clamp(90px,14vh,130px)] sm:px-8 lg:px-8 lg:pb-28 lg:pt-32 xl:px-10"
          style={{opacity: contentOpacity, scale: contentScale}}>
          <div className="grid grid-cols-1 items-center lg:grid-cols-[1.1fr_0.9fr] lg:gap-x-16 xl:gap-x-24 lg:[grid-template-areas:'badge_profile'_'kicker_profile'_'name_profile'_'role_profile'_'desc_profile'_'cta_profile'_'lwt_profile'_'socials_profile']">
            {/* Availability badge */}
            <motion.span
              animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-neutral-300 backdrop-blur-md lg:mx-0 lg:mb-0 lg:[grid-area:badge]"
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

            {/* Profile visual */}
            <motion.div
              animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, scale: 1, y: FADE_SHOW.y}}
              className="relative mx-auto mb-6 w-fit lg:mb-0 lg:[grid-area:profile] lg:self-center"
              initial={reduceMotion ? {opacity: 0} : {opacity: FADE_DELAY.opacity, scale: 0.9, y: FADE_DELAY.y}}
              transition={{delay: 0.2, duration: 0.9, ease: floatEase}}>
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{x: glowX, y: glowY}}>
                <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.16),transparent_70%)] opacity-60 blur-2xl lg:opacity-100" />
              </motion.div>

              {/* Orbital rings */}
              {!reduceMotion && (
                <>
                  <motion.div
                    animate={{rotate: 360}}
                    aria-hidden="true"
                    className="absolute -inset-6 rounded-full border border-dashed border-white/5 lg:-inset-14 lg:border-white/10"
                    transition={{duration: 50, ease: 'linear', repeat: Infinity}}>
                    <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <span className="absolute -bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
                  </motion.div>
                  <motion.div
                    animate={{rotate: 360}}
                    aria-hidden="true"
                    className="absolute -inset-4 hidden rounded-full border border-white/[0.06] lg:-inset-8 lg:block"
                    transition={{duration: 28, ease: 'linear', repeat: Infinity}}>
                    <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                    <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 translate-y-1/2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.8)]" />
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
                    className={`absolute inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 px-2.5 py-1.5 text-[10px] font-semibold text-neutral-200 shadow-lg shadow-black/40 backdrop-blur-md sm:px-3 sm:text-[11px] ${
                      card.desktopOnly ? 'hidden lg:inline-flex' : ''
                    } ${card.pos}`}
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
                  animate={reduceMotion ? undefined : {y: [0, -8, 0]}}
                  className="relative aspect-square w-[min(58vw,210px)] overflow-hidden rounded-full sm:w-64 lg:w-80"
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

            {/* Kicker */}
            <motion.p
              animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mb-2 text-center font-mono text-xs font-semibold uppercase tracking-[0.35em] text-orange-400 lg:mb-0 lg:mt-8 lg:[grid-area:kicker] lg:text-left"
              initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
              transition={{delay: 0.25, duration: 0.6, ease: floatEase}}>
              Hi, I&apos;m
            </motion.p>

            {/* Name */}
            <motion.h1
              animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mb-3 text-center text-[clamp(2.375rem,10vw,3.375rem)] font-extrabold leading-[1.05] tracking-tight text-white lg:mb-0 lg:mt-3 lg:text-left lg:text-6xl lg:[grid-area:name] xl:text-7xl"
              initial={reduceMotion ? {opacity: 0} : FADE_DELAY}
              transition={{delay: 0.35, duration: 0.7, ease: floatEase}}>
              Shubham Deo
            </motion.h1>

            {/* Role */}
            <motion.h2
              animate={
                reduceMotion
                  ? {opacity: 1}
                  : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y, backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']}
              }
              className="mb-5 bg-[linear-gradient(90deg,#f97316,#fbbf24,#06b6d4,#f97316)] bg-clip-text bg-[length:220%_auto] text-center text-[clamp(1.6875rem,7.5vw,2.375rem)] font-bold leading-[1.1] tracking-tight text-transparent lg:mb-0 lg:mt-3 lg:text-left lg:text-4xl lg:[grid-area:role] xl:text-5xl"
              initial={reduceMotion ? {opacity: 0} : {opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
              transition={{delay: 0.45, duration: 0.7, ease: floatEase}}>
              {ROLE}
            </motion.h2>

            {/* Description */}
            <motion.div
              animate={reduceMotion ? {opacity: 1} : {opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mx-auto mb-7 max-w-[340px] text-center text-base leading-[1.65] text-neutral-400 lg:mx-0 lg:mb-0 lg:mt-6 lg:max-w-xl lg:text-left lg:text-lg lg:leading-relaxed lg:[grid-area:desc]"
              initial={reduceMotion ? {opacity: 0} : FADE_DELAY}
              transition={{delay: 0.6, duration: 0.7, ease: floatEase}}>
              {description}
            </motion.div>

            {/* CTAs */}
            <motion.div
              animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="flex w-full flex-col items-center gap-3 lg:mt-10 lg:w-auto lg:flex-row lg:items-center lg:gap-4 lg:[grid-area:cta]"
              initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
              transition={{delay: 0.75, duration: 0.6, ease: floatEase}}>
              <MagneticButton
                className="h-[52px] w-full justify-center max-w-[360px] lg:max-w-none lg:w-auto"
                href={primaryAction.href}
                icon={workIcon}
                iconPosition="right"
                variant="primary">
                {primaryAction.text}
              </MagneticButton>
              <MagneticButton
                className="h-[52px] w-full justify-center max-w-[360px] lg:max-w-none lg:w-auto"
                download={actions[1]?.download}
                href={actions[1].href}
                icon={downloadIcon}
                iconPosition="right"
                variant="outline">
                {actions[1].text}
              </MagneticButton>
            </motion.div>

            {/* Let's Work Together */}
            <motion.div
              animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mt-6 flex justify-center lg:mt-8 lg:justify-start lg:[grid-area:lwt]"
              initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
              transition={{delay: 0.9, duration: 0.6, ease: floatEase}}>
              <Link
                className="group inline-flex items-center gap-2 text-sm font-semibold text-neutral-300 transition-colors duration-300 hover:text-orange-400"
                href={`#${SectionId.Contact}`}>
                Let&apos;s Work Together
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* Socials */}
            <motion.div
              animate={{opacity: FADE_SHOW.opacity, y: FADE_SHOW.y}}
              className="mt-8 flex justify-center lg:mt-10 lg:justify-start lg:[grid-area:socials]"
              initial={{opacity: FADE_DELAY.opacity, y: FADE_DELAY.y}}
              transition={{delay: 1.05, duration: 0.6, ease: floatEase}}>
              <Socials variant="chips" />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <div className="mt-8 flex justify-center lg:absolute lg:inset-x-0 lg:bottom-4 lg:mt-0">
            <motion.div
              animate={{opacity: 1}}
              initial={{opacity: 0}}
              transition={{delay: 1.3, duration: 0.8}}
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
          </div>
        </motion.div>
      </MotionConfig>
    </section>
  );
});

Hero.displayName = 'Hero';
export default Hero;
