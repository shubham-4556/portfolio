import {XMarkIcon} from '@heroicons/react/24/outline';
import {AnimatePresence, motion, useReducedMotion} from 'framer-motion';
import {FC, memo, useEffect} from 'react';

import TestimonialForm from './TestimonialForm';

interface TestimonialModalProps {
  open: boolean;
  onClose: () => void;
}

const TestimonialModal: FC<TestimonialModalProps> = memo(({open, onClose}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{opacity: 1}}
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center sm:p-6"
          exit={{opacity: 0}}
          initial={{opacity: 0}}>
          <motion.div
            animate={{opacity: 1}}
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            exit={{opacity: 0}}
            initial={{opacity: 0}}
            onClick={onClose}
          />
          <motion.div
            animate={shouldReduceMotion ? {opacity: 1} : {opacity: 1, scale: 1, y: 0}}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-neutral-900 p-6 shadow-2xl shadow-black/50 sm:p-8"
            exit={shouldReduceMotion ? {opacity: 0} : {opacity: 0, scale: 0.97, y: 20}}
            initial={shouldReduceMotion ? {opacity: 0} : {opacity: 0, scale: 0.97, y: 40}}
            transition={{duration: 0.3, ease: 'easeOut'}}>
            <div className="mb-5 flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-orange-500">
                  // Share feedback
                </span>
                <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-white">Give a Testimonial</h3>
                <p className="mt-1 text-sm text-neutral-400">
                  I&apos;d love to hear about your experience working with me.
                </p>
              </div>
              <button
                aria-label="Close modal"
                className="-mr-2 -mt-2 rounded-lg p-2 text-neutral-400 transition-colors duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                onClick={onClose}
                type="button">
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <TestimonialForm onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

TestimonialModal.displayName = 'TestimonialModal';
export default TestimonialModal;
