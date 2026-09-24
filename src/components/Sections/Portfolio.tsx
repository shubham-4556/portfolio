import {ArrowUpRightIcon} from '@heroicons/react/24/outline';
import {motion, useMotionValue, useReducedMotion, useSpring, useTransform} from 'framer-motion';
import Image from 'next/image';
import {FC, memo, MouseEvent, useMemo, useRef} from 'react';

import {portfolioItems, SectionId} from '../../data/data';
import {PortfolioItem} from '../../data/dataDef';
import GithubIcon from '../Icon/GithubIcon';
import Section from '../Layout/Section';
import {GradientText} from '../ui/AnimatedText';
import {MagneticButton} from '../ui/MagneticButton';

const easing = [0.175, 0.885, 0.32, 1.275] as const;

const Portfolio: FC = memo(() => {
  return (
    <Section className="relative overflow-hidden bg-neutral-800" sectionId={SectionId.Portfolio}>
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-y-14">
        <SectionHeader />

        <div className="grid auto-rows-fr grid-cols-1 gap-8 sm:grid-cols-2">
          {portfolioItems.map((item, index) => (
            <ProjectCard item={item} key={`${item.title}-${index}`} />
          ))}
        </div>
      </div>
    </Section>
  );
});

Portfolio.displayName = 'Portfolio';
export default Portfolio;

const SectionHeader: FC = memo(() => {
  return (
    <motion.div
      className="flex flex-col items-center gap-y-4 text-center"
      initial={{opacity: 0, y: 30}}
      transition={{duration: 0.7, ease: easing}}
      viewport={{once: true, margin: '-80px'}}
      whileInView={{opacity: 1, y: 0}}>
      <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
        // 01. Selected Work
      </span>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        <GradientText gradient="from-orange-400 via-orange-500 to-cyan-400">Featured Projects</GradientText>
      </h2>
      <p className="max-w-2xl text-sm text-gray-300 sm:text-base">
        A selection of production-ready applications I have designed and built as a full stack developer.
      </p>
    </motion.div>
  );
});
SectionHeader.displayName = 'SectionHeader';

const ProjectCard: FC<{item: PortfolioItem}> = memo(({item}) => {
  const {title, description, url, image, tags, githubUrl} = item;
  const cardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springConfig = {stiffness: 160, damping: 14, mass: 0.4};
  const springX = useSpring(mx, springConfig);
  const springY = useSpring(my, springConfig);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);

  const liveIcon = useMemo(() => <ArrowUpRightIcon className="h-4 w-4" />, []);
  const githubIcon = useMemo(() => <GithubIcon className="h-4 w-4" />, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mx.set((event.clientX - rect.left) / rect.width - 0.5);
    my.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-neutral-900/60 shadow-xl shadow-black/30 backdrop-blur-sm transition-colors duration-300 hover:border-orange-500/40"
      initial={{opacity: 0, y: 40}}
      ref={cardRef}
      style={{rotateX, rotateY, transformStyle: 'preserve-3d'}}
      transition={{duration: 0.7, ease: easing}}
      viewport={{once: true, margin: '-80px'}}
      whileInView={{opacity: 1, y: 0}}>
      <div
        className="flex h-full flex-col gap-6 p-6 sm:p-8"
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
          <motion.div className="h-full w-full" whileHover={shouldReduceMotion ? undefined : {scale: 1.04}}>
            <Image alt={title} className="h-full w-full object-cover" placeholder="blur" src={image} />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            Live
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-4">
          <h3 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">{title}</h3>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300 transition-colors duration-300 hover:border-orange-500/50 hover:text-orange-400"
                  key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <p className="text-sm leading-relaxed text-gray-300">{description}</p>

          <div className="mt-2 flex flex-wrap gap-3">
            <MagneticButton
              href={url}
              icon={liveIcon}
              iconPosition="right"
              rel="noopener noreferrer"
              size="md"
              strength={20}
              target="_blank"
              variant="primary">
              Live Demo
            </MagneticButton>
            {githubUrl && (
              <MagneticButton
                href={githubUrl}
                icon={githubIcon}
                iconPosition="right"
                rel="noopener noreferrer"
                size="md"
                strength={20}
                target="_blank"
                variant="outline">
                Source Code
              </MagneticButton>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
});
ProjectCard.displayName = 'ProjectCard';
