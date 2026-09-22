'use client';

import {motion, MotionConfig, Variants} from 'framer-motion';
import Image from 'next/image';
import {FC, memo, useMemo} from 'react';

import {aboutData, SectionId} from '../../data/data';
import Section from '../Layout/Section';
import {GradientText} from '../ui/AnimatedText';

const SPRING_EASE: [number, number, number, number] = [0.175, 0.885, 0.32, 1.275];
const VIEWPORT = {amount: 0.2, once: true};

const staggerContainer: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.1}},
};

const riseItem: Variants = {
  hidden: {opacity: 0, y: 32},
  hover: {transition: {duration: 0.25}, y: -6},
  show: {opacity: 1, transition: {duration: 0.7, ease: SPRING_EASE}, y: 0},
};

const wordItem: Variants = {
  hidden: {filter: 'blur(6px)', opacity: 0, y: 14},
  show: {filter: 'blur(0px)', opacity: 1, transition: {duration: 0.45, ease: 'easeOut'}, y: 0},
};

const portraitItem: Variants = {
  hidden: {opacity: 0, rotate: -8, scale: 0.85, x: -40},
  show: {opacity: 1, rotate: 0, scale: 1, transition: {duration: 0.9, ease: SPRING_EASE}, x: 0},
};

const About: FC = memo(() => {
  const {profileImageSrc, description, aboutItems} = aboutData;
  const descriptionWords = useMemo(() => description.trim().split(/\s+/), [description]);

  return (
    <Section className="relative overflow-hidden bg-neutral-900" sectionId={SectionId.About}>
      <MotionConfig reducedMotion="user">
        {/* Decorative glow orbs */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-20 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
          initial={{opacity: 0, scale: 0.6}}
          transition={{duration: 1.4, ease: 'easeOut'}}
          viewport={VIEWPORT}
          whileInView={{opacity: 1, scale: 1}}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -right-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
          initial={{opacity: 0, scale: 0.6}}
          transition={{delay: 0.2, duration: 1.4, ease: 'easeOut'}}
          viewport={VIEWPORT}
          whileInView={{opacity: 1, scale: 1}}
        />

        <div className="relative z-10 flex flex-col gap-y-12">
          {/* Section heading */}
          <div className="flex flex-col items-start gap-y-3">
            <motion.span
              className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400"
              initial={{opacity: 0, x: -24}}
              transition={{duration: 0.6, ease: 'easeOut'}}
              viewport={VIEWPORT}
              whileInView={{opacity: 1, x: 0}}>
              Introduction
            </motion.span>
            <motion.h2
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              initial={{opacity: 0, y: 30}}
              transition={{delay: 0.1, duration: 0.7, ease: SPRING_EASE}}
              viewport={VIEWPORT}
              whileInView={{opacity: 1, y: 0}}>
              About <GradientText>me</GradientText>
            </motion.h2>
            <motion.div
              className="h-1 w-20 origin-left rounded-full bg-gradient-to-r from-orange-500 to-cyan-400"
              initial={{opacity: 0, scaleX: 0}}
              transition={{delay: 0.25, duration: 0.7, ease: 'easeOut'}}
              viewport={VIEWPORT}
              whileInView={{opacity: 1, scaleX: 1}}
            />
          </div>

          {/* Content grid */}
          <div className="grid min-w-0 grid-cols-1 gap-y-10 md:grid-cols-[auto_minmax(0,1fr)] md:gap-x-10 lg:gap-x-12">
            {/* Portrait */}
            {!!profileImageSrc && (
              <motion.div
                className="group flex justify-center md:justify-start"
                initial="hidden"
                variants={portraitItem}
                viewport={VIEWPORT}
                whileInView="show">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-[2rem] bg-gradient-to-tr from-orange-500/50 via-transparent to-cyan-500/50 blur-xl"
                  />
                  <div className="relative h-44 w-44 overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl shadow-orange-500/10 transition-transform duration-500 group-hover:scale-105 sm:h-52 sm:w-52 md:h-48 md:w-48 lg:h-60 lg:w-60">
                    <Image alt="about-me-image" className="h-full w-full object-cover" src={profileImageSrc} />
                  </div>
                  <motion.span
                    animate={{scale: [1, 1.25, 1]}}
                    className="absolute -bottom-2 -right-2 h-5 w-5 rounded-full border-2 border-neutral-900 bg-green-500 shadow-lg shadow-green-500/40"
                    transition={{duration: 2, ease: 'easeInOut', repeat: Infinity}}
                  />
                </div>
              </motion.div>
            )}

            {/* Description + highlights */}
            <div className="flex min-w-0 flex-col gap-y-8">
              <motion.p
                className="text-base leading-relaxed text-gray-300 sm:text-lg"
                initial="hidden"
                variants={staggerContainer}
                viewport={VIEWPORT}
                whileInView="show">
                {descriptionWords.map((word, index) => (
                  <motion.span className="mr-[0.25em] inline-block" key={index} variants={wordItem}>
                    {word}
                  </motion.span>
                ))}
              </motion.p>

              <motion.ul
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                initial="hidden"
                variants={staggerContainer}
                viewport={VIEWPORT}
                whileInView="show">
                {aboutItems.map(({Icon, label, text}, index) => (
                  <motion.li
                    className="group flex items-start gap-x-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl transition-colors duration-300 hover:border-orange-500/40"
                    key={index}
                    variants={riseItem}
                    whileHover="hover">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-cyan-500/20 transition-transform duration-300 group-hover:scale-110">
                      {Icon && <Icon className="h-5 w-5 text-orange-400" />}
                    </span>
                    <div className="flex flex-col gap-y-1">
                      <span className="text-sm font-bold text-white">{label}</span>
                      <span className="text-sm text-gray-300">{text}</span>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </div>
        </div>
      </MotionConfig>
    </Section>
  );
});

About.displayName = 'About';
export default About;
