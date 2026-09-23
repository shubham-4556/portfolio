// @ts-nocheck
'use client';

import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {motion, useScroll, useTransform} from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {memo} from 'react';

import Socials from '@/components/Socials';
import {GradientText, ShimmerText} from '@/components/ui/AnimatedText';
import {MagneticButton} from '@/components/ui/MagneticButton';
import {heroData, SectionId} from '@/data/data';

// const ThreeBackground = dynamic(() => import('@/components/ui/ThreeBackground'), {
//   ssr: false,
//   loading: () => <div className="fixed inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-cyan-500/20" />,
// });

const Hero = () => {
  const {name, description, actions} = heroData;
  const {scrollY} = useScroll();
  const scrollFade = useTransform(scrollY, [0, 120], [1, 0]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" id={SectionId.Hero}>
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-gradient-glow))] opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22/%3E%3C/svg%3E')]" />

      {/* Floating Orb Decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-slow"
        style={{animationDelay: '2s'}}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-orange-500/5 blur-3xl animate-pulse-slow"
        style={{animationDelay: '1s'}}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center">
          {/* Profile Image */}
          <motion.div
            animate={{opacity: 1, scale: 1, y: 0}}
            className="mb-10 relative inline-block"
            initial={{opacity: 0, scale: 0.8, y: 30}}
            transition={{duration: 0.8, ease: [0.175, 0.885, 0.32, 1.275]}}>
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500 to-cyan-500 blur-2xl opacity-30 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-orange-500/30 animate-spin-slow" />
              <Image
                alt="Shubham Deo"
                className="object-cover rounded-full border-4 border-white/10 shadow-2xl shadow-orange-500/20"
                fill
                priority
                src="/images/profilepic.jpg"
              />
            </div>

            {/* Status Indicator */}
            <motion.div
              animate={{scale: [1, 1.2, 1]}}
              className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-4 border-gray-900"
              transition={{duration: 2, repeat: Infinity, ease: 'easeInOut'}}
            />
          </motion.div>

          {/* Name */}
          <h1 className="mb-6 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-tight">
            <span className="text-white">{name.replace("I'm ", "I'm ")}</span>
            <br />
            <GradientText gradient="from-orange-400 via-orange-500 to-cyan-400">Full Stack Developer</GradientText>
          </h1>

          {/* Tagline */}
          <p className="mb-10 max-w-3xl mx-auto text-lg sm:text-xl md:text-2xl text-gray-300 leading-relaxed">
            {typeof description === 'object' ? (
              <>
                <span className="text-gray-200">I build </span>
                <ShimmerText duration={3}>responsive, scalable & user-friendly web applications</ShimmerText>
                <span className="text-gray-200"> using modern technologies.</span>
              </>
            ) : (
              description
            )}
          </p>

          {/* Tech Stack Badges */}
          <motion.div
            animate={{opacity: 1, y: 0}}
            className="mb-10 flex flex-wrap items-center justify-center gap-3"
            initial={{opacity: 0, y: 30}}
            transition={{duration: 0.8, delay: 0.6, ease: [0.175, 0.885, 0.32, 1.275]}}>
            {['TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Tailwind', 'AI/ML', 'MCP'].map((tech, i) => (
              <motion.span
                animate={{opacity: 1, scale: 1}}
                className="px-4 py-1.5 text-sm font-medium text-gray-200 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
                initial={{opacity: 0, scale: 0.8}}
                key={tech}
                transition={{delay: 0.6 + i * 0.08, duration: 0.5, ease: [0.175, 0.885, 0.32, 1.275]}}>
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            animate={{opacity: 1, y: 0}}
            className="mb-16 mx-auto grid w-full max-w-lg grid-cols-1 gap-4 sm:grid-cols-2"
            initial={{opacity: 0, y: 30}}
            transition={{duration: 0.8, delay: 0.8, ease: [0.175, 0.885, 0.32, 1.275]}}>
            {actions.map((action, _index) => (
              <MagneticButton
                className="w-full"
                href={action.href}
                key={action.text}
                rel={action.href.startsWith('#') ? undefined : 'noopener noreferrer'}
                size="lg"
                strength={25}
                target={action.href.startsWith('#') ? undefined : '_blank'}
                variant="primary">
                {action.text}
                {action.Icon && <action.Icon className="w-5 h-5" />}
              </MagneticButton>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div
            animate={{opacity: 1, y: 0}}
            className="flex items-center justify-center gap-6"
            initial={{opacity: 0, y: 30}}
            transition={{duration: 0.8, delay: 1, ease: [0.175, 0.885, 0.32, 1.275]}}>
            <Socials />
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{opacity: 1}}
            className="mt-16 flex flex-col items-center gap-3 text-gray-400"
            initial={{opacity: 0}}
            transition={{delay: 1.5, duration: 0.8}}>
            <motion.div className="flex flex-col items-center gap-3" style={{opacity: scrollFade}}>
              <span className="text-xs font-medium uppercase tracking-widest">Scroll to explore</span>
              <Link
                aria-label="Scroll to about section"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-300"
                href={`#${SectionId.About}`}>
                <motion.div animate={{y: [0, 8, 0]}} transition={{duration: 1.5, repeat: Infinity, ease: 'easeInOut'}}>
                  <ChevronDownIcon className="h-6 w-6" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
