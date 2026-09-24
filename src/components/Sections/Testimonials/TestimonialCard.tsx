import {StarIcon} from '@heroicons/react/24/solid';
import {motion, useReducedMotion} from 'framer-motion';
import {FC, memo, useState} from 'react';

import {PublicTestimonial} from '../../../lib/testimonials/types';
import LinkedInIcon from '../../Icon/LinkedInIcon';
import QuoteIcon from '../../Icon/QuoteIcon';

interface TestimonialCardProps {
  testimonial: PublicTestimonial;
}

const TestimonialCard: FC<TestimonialCardProps> = memo(({testimonial}) => {
  const {name, role, company, testimonial: text, rating, linkedinUrl, profileImage} = testimonial;
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  const showImage = profileImage && !imageFailed;
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');

  return (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-lg shadow-black/20 backdrop-blur-sm transition-colors duration-300 hover:border-orange-500/40 hover:shadow-2xl hover:shadow-orange-500/10"
      whileHover={shouldReduceMotion ? undefined : {y: -6}}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <QuoteIcon className="absolute right-5 top-5 h-8 w-8 text-orange-500/15 transition-all duration-300 group-hover:rotate-6 group-hover:scale-110 group-hover:text-orange-500/30" />

      {rating > 0 && (
        <div aria-label={`Rated ${rating} out of 5`} className="mb-4 flex items-center gap-0.5" role="img">
          {[1, 2, 3, 4, 5].map(star => (
            <StarIcon
              className={star <= rating ? 'h-4 w-4 text-orange-400' : 'h-4 w-4 text-white/15'}
              key={`${name}-star-${star}`}
            />
          ))}
        </div>
      )}

      <p className="flex-1 text-sm leading-relaxed text-neutral-300">{text}</p>

      <div className="mt-6 flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 opacity-40 transition-opacity duration-300 group-hover:opacity-100" />
          {showImage ? (
            <img
              alt={name}
              className="relative h-11 w-11 rounded-full object-cover ring-2 ring-neutral-900"
              onError={() => setImageFailed(true)}
              src={profileImage}
            />
          ) : (
            <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 text-sm font-bold text-white">
              {initials || '?'}
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">{name}</p>
          <p className="truncate text-xs text-neutral-400">
            {role}
            {company ? <span className="text-neutral-500"> at {company}</span> : null}
          </p>
        </div>
        {linkedinUrl && (
          <a
            aria-label={`${name} on LinkedIn`}
            className="ml-auto rounded-md p-1.5 text-neutral-400 transition-colors duration-300 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            href={linkedinUrl}
            rel="noopener noreferrer"
            target="_blank">
            <LinkedInIcon className="h-4 w-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
});

TestimonialCard.displayName = 'TestimonialCard';
export default TestimonialCard;
