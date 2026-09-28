// @ts-nocheck
'use client';

import {CodeBracketIcon, ServerStackIcon, SparklesIcon, SwatchIcon} from '@heroicons/react/24/outline';
import {motion, MotionConfig, Variants} from 'framer-motion';
import {FC, memo, useMemo} from 'react';

import {SectionId} from '../../data/data';
import Section from '../Layout/Section';

const SPRING_EASE: [number, number, number, number] = [0.175, 0.885, 0.32, 1.275];
const VIEWPORT = {amount: 0.2, once: true};

const staggerContainer: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.12}},
};

const revealItem: Variants = {
  hidden: {opacity: 0, y: 36},
  show: {opacity: 1, transition: {duration: 0.7, ease: SPRING_EASE}, y: 0},
};

const infoCards = [
  {
    number: '01',
    title: 'Full Stack Development',
    description: 'End-to-end web apps — from pixel-perfect frontends to robust APIs, databases, and deployment.',
    Icon: CodeBracketIcon,
    accent: 'text-orange-400',
  },
  {
    number: '02',
    title: 'Modern UI Engineering',
    description:
      'Responsive interfaces built with React, Next.js, and Tailwind, tuned for speed, accessibility, and delight.',
    Icon: SwatchIcon,
    accent: 'text-amber-300',
  },
  {
    number: '03',
    title: 'Backend & Database',
    description: 'Scalable Node.js and Express.js APIs backed by PostgreSQL, designed around clean, maintainable code.',
    Icon: ServerStackIcon,
    accent: 'text-cyan-400',
  },
  {
    number: '04',
    title: 'AI & MCP',
    description:
      'Practical AI features and Model Context Protocol tooling that make products smarter without the hype.',
    Icon: SparklesIcon,
    accent: 'text-fuchsia-400',
  },
];

const technologies = [
  {name: 'TypeScript', mono: 'TS', tint: 'text-blue-300'},
  {name: 'JavaScript', mono: 'JS', tint: 'text-amber-300'},
  {name: 'React', mono: 'Re', tint: 'text-cyan-300'},
  {name: 'Next.js', mono: 'Nx', tint: 'text-neutral-100'},
  {name: 'Node.js', mono: 'Nd', tint: 'text-green-300'},
  {name: 'Express.js', mono: 'Ex', tint: 'text-neutral-300'},
  {name: 'PostgreSQL', mono: 'Pg', tint: 'text-sky-300'},
  {name: 'Tailwind CSS', mono: 'Tw', tint: 'text-teal-300'},
  {name: 'Git', mono: 'Gt', tint: 'text-red-300'},
  {name: 'GitHub', mono: 'Gh', tint: 'text-violet-300'},
  {name: 'AI/ML', mono: 'AI', tint: 'text-fuchsia-300'},
  {name: 'MCP', mono: 'MC', tint: 'text-orange-300'},
];

const About: FC = memo(() => {
  const kickerWords = useMemo(() => 'Building digital experiences that actually matter.'.split(' '), []);

  return (
    <Section className="relative overflow-hidden bg-[#080808]" sectionId={SectionId.About}>
      <MotionConfig reducedMotion="user">
        {/* Ambient background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-24 h-96 w-96 rounded-full bg-cyan-500/[0.06] blur-3xl" />
          <div className="absolute -left-32 bottom-40 h-80 w-80 rounded-full bg-orange-500/[0.07] blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]" />
        </div>

        <div className="relative z-10">
          {/* Editorial heading */}
          <motion.div
            className="grid grid-cols-1 gap-y-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-x-16"
            initial="hidden"
            variants={staggerContainer}
            viewport={VIEWPORT}
            whileInView="show">
            <div className="flex flex-col items-start gap-y-4">
              <motion.span
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.35em] text-orange-400"
                variants={revealItem}>
                <span aria-hidden="true" className="h-px w-8 bg-gradient-to-r from-orange-500 to-transparent" />
                About Me
              </motion.span>
              <motion.h2
                className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
                variants={revealItem}>
                {kickerWords.map((word, index) => {
                  const gradient = index >= 1 && index <= 2;
                  return (
                    <span
                      className={
                        gradient
                          ? 'bg-[linear-gradient(90deg,#f97316,#fbbf24,#06b6d4)] bg-clip-text text-transparent'
                          : ''
                      }
                      key={index}>
                      {word}{' '}
                    </span>
                  );
                })}
              </motion.h2>
              <motion.div
                aria-hidden="true"
                className="h-px w-full max-w-xs bg-gradient-to-r from-orange-500/60 via-amber-400/40 to-transparent"
                variants={revealItem}
              />
            </div>

            <motion.p className="max-w-xl text-base leading-relaxed text-neutral-400 sm:text-lg" variants={revealItem}>
              {`I'm Shubham Deo, a Full Stack Developer focused on building modern, scalable and intuitive web
              applications. I care about clean architecture, thoughtful design, and shipping products people genuinely
              enjoy using.`}
            </motion.p>
          </motion.div>

          {/* Info cards */}
          <motion.div
            className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2"
            initial="hidden"
            variants={staggerContainer}
            viewport={VIEWPORT}
            whileInView="show">
            {infoCards.map(({Icon, accent, description, number, title}, index) => (
              <motion.article
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 hover:border-orange-400/40 hover:bg-white/[0.05] hover:shadow-[0_0_50px_-12px_rgba(249,115,22,0.35)]"
                key={index}
                variants={revealItem}
                whileHover={{y: -6}}>
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-orange-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                    <Icon className={`h-5 w-5 ${accent}`} />
                  </span>
                  <span className="font-mono text-sm font-bold tracking-widest text-neutral-600 transition-colors duration-500 group-hover:text-orange-400/70">
                    {number}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">{description}</p>
              </motion.article>
            ))}
          </motion.div>

          {/* Tech stack */}
          <motion.div
            className="mt-20 flex flex-col items-center gap-y-8"
            initial="hidden"
            variants={staggerContainer}
            viewport={VIEWPORT}
            whileInView="show">
            <motion.div className="flex flex-col items-center gap-y-3" variants={revealItem}>
              <motion.span
                className="font-mono text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400"
                variants={revealItem}>
                Technologies I Work With
              </motion.span>
              <motion.div
                aria-hidden="true"
                className="h-px w-24 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"
                variants={revealItem}
              />
            </motion.div>

            <motion.ul
              className="flex max-w-3xl flex-wrap items-center justify-center gap-3"
              initial="hidden"
              variants={staggerContainer}
              viewport={VIEWPORT}
              whileInView="show">
              {technologies.map(({mono, name, tint}, index) => (
                <motion.li className="group relative" key={index} variants={revealItem} whileHover={{y: -6}}>
                  <span className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#050505] px-2.5 py-1 text-[11px] font-medium text-neutral-300 opacity-0 shadow-lg shadow-black/40 transition-opacity duration-300 group-hover:opacity-100">
                    {name}
                  </span>
                  <span className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-neutral-200 backdrop-blur-md transition-all duration-300 group-hover:border-orange-400/40 group-hover:bg-orange-500/10 group-hover:shadow-[0_0_24px_-6px_rgba(249,115,22,0.45)]">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-md bg-white/5 font-mono text-[10px] font-bold ${tint}`}>
                      {mono}
                    </span>
                    {name}
                  </span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </MotionConfig>
    </Section>
  );
});

About.displayName = 'About';
export default About;
