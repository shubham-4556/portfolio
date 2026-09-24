import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/outline';
import {motion, useReducedMotion, Variants} from 'framer-motion';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';

import {SectionId} from '../../data/data';
import {FALLBACK_TESTIMONIALS} from '../../lib/testimonials/fallback';
import {PublicTestimonial} from '../../lib/testimonials/types';
import Section from '../Layout/Section';
import {GradientText} from '../ui/AnimatedText';
import TestimonialCard from './Testimonials/TestimonialCard';
import TestimonialModal from './Testimonials/TestimonialModal';

const easing = [0.175, 0.885, 0.32, 1.275] as const;

const containerVariants: Variants = {
  hidden: {},
  show: {transition: {staggerChildren: 0.12, delayChildren: 0.1}},
};

const itemVariants: Variants = {
  hidden: {opacity: 0, y: 30},
  show: {opacity: 1, y: 0, transition: {duration: 0.55, ease: easing}},
};

const Testimonials: FC = memo(() => {
  const [list, setList] = useState<PublicTestimonial[]>(FALLBACK_TESTIMONIALS);
  const [modalOpen, setModalOpen] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const shouldReduceMotion = useReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const handleCloseModal = useCallback(() => setModalOpen(false), []);

  useEffect(() => {
    let active = true;
    fetch('/api/testimonials')
      .then(response => (response.ok ? response.json() : Promise.reject(new Error('fetch failed'))))
      .then((payload: {testimonials?: PublicTestimonial[]}) => {
        if (active && Array.isArray(payload.testimonials) && payload.testimonials.length > 0) {
          setList(payload.testimonials);
        }
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const recompute = () => {
      setTotalPages(Math.max(1, Math.round(element.scrollWidth / element.clientWidth)));
      setActivePage(Math.round(element.scrollLeft / element.clientWidth));
    };
    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(element);
    window.addEventListener('resize', recompute);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', recompute);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    setActivePage(Math.round(element.scrollLeft / element.clientWidth));
  }, []);

  const scrollToPage = useCallback(
    (page: number) => {
      const element = scrollRef.current;
      if (!element) return;
      const clamped = Math.min(Math.max(page, 0), totalPages - 1);
      element.scrollTo({left: clamped * element.clientWidth, behavior: shouldReduceMotion ? 'auto' : 'smooth'});
      setActivePage(clamped);
    },
    [shouldReduceMotion, totalPages],
  );

  const scrollToNext = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    const maxScroll = element.scrollWidth - element.clientWidth;
    if (element.scrollLeft >= maxScroll - 4) {
      element.scrollTo({left: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth'});
    } else {
      element.scrollBy({left: element.clientWidth, behavior: shouldReduceMotion ? 'auto' : 'smooth'});
    }
  }, [shouldReduceMotion]);

  const scrollToPrevious = useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;
    if (element.scrollLeft <= 4) {
      element.scrollTo({left: element.scrollWidth, behavior: shouldReduceMotion ? 'auto' : 'smooth'});
    } else {
      element.scrollBy({left: -element.clientWidth, behavior: shouldReduceMotion ? 'auto' : 'smooth'});
    }
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(scrollToNext, 9000);
    return () => clearInterval(interval);
  }, [scrollToNext, shouldReduceMotion]);

  return (
    <Section className="relative overflow-hidden bg-neutral-900" sectionId={SectionId.Testimonials}>
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-y-12">
        {/* Header */}
        <motion.div
          className="flex flex-col items-center gap-y-3 text-center"
          initial={{opacity: 0, y: 30}}
          transition={{duration: 0.7, ease: easing}}
          viewport={{once: true, margin: '-80px'}}
          whileInView={{opacity: 1, y: 0}}>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
            // 03. Testimonials
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            <GradientText gradient="from-orange-400 via-orange-500 to-cyan-400">What People Say</GradientText>
          </h2>
          <p className="max-w-xl text-sm text-gray-300 sm:text-base">
            Feedback from people I&apos;ve worked and collaborated with.
          </p>
        </motion.div>

        {list.length > 0 ? (
          <motion.div
            className="flex flex-col gap-y-6"
            initial="hidden"
            variants={containerVariants}
            viewport={{once: true, margin: '-80px'}}
            whileInView="show">
            <div
              className="no-scrollbar flex touch-pan-x snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth"
              onScroll={handleScroll}
              ref={scrollRef}>
              {list.map(item => (
                <motion.div
                  className="w-full shrink-0 snap-start sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
                  key={item.id}
                  variants={itemVariants}>
                  <TestimonialCard testimonial={item} />
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                aria-label="Previous testimonials"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 transition-all duration-300 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                onClick={scrollToPrevious}
                type="button">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              {totalPages > 1 && (
                <div aria-label="Testimonial pages" className="mx-2 flex items-center gap-2" role="tablist">
                  {Array.from({length: totalPages}, (_, index) => {
                    const isActive = index === activePage;
                    return (
                      <button
                        aria-label={`Go to testimonial page ${index + 1}`}
                        aria-selected={isActive}
                        className={`h-2 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${
                          isActive
                            ? 'w-6 bg-gradient-to-r from-orange-500 to-orange-600'
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        key={`dot-${index}`}
                        onClick={() => scrollToPage(index)}
                        role="tab"
                        type="button"
                      />
                    );
                  })}
                </div>
              )}
              <button
                aria-label="Next testimonials"
                className="rounded-full border border-white/10 bg-white/5 p-2 text-neutral-300 transition-all duration-300 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                onClick={scrollToNext}
                type="button">
                <ArrowRightIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ) : null}

        {/* CTA */}
        <motion.div
          className="mx-auto w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-sm sm:p-10"
          initial={{opacity: 0, y: 30}}
          transition={{duration: 0.7, ease: easing}}
          viewport={{once: true, margin: '-60px'}}
          whileInView={{opacity: 1, y: 0}}>
          <h3 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Worked with me?</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-neutral-400 sm:text-base">
            I&apos;d love to hear about your experience working together.
          </p>
          <motion.button
            className="group mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 hover:shadow-orange-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
            onClick={() => setModalOpen(true)}
            type="button"
            whileHover={shouldReduceMotion ? undefined : {scale: 1.03}}
            whileTap={shouldReduceMotion ? undefined : {scale: 0.97}}>
            Give a Testimonial
            <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </motion.button>
        </motion.div>
      </div>

      <TestimonialModal onClose={handleCloseModal} open={modalOpen} />
    </Section>
  );
});

Testimonials.displayName = 'Testimonials';
export default Testimonials;
