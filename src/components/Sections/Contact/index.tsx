import {CheckIcon, ClipboardIcon, ClockIcon, EnvelopeIcon, MapPinIcon} from '@heroicons/react/24/outline';
import {motion, useReducedMotion} from 'framer-motion';
import {FC, memo, useCallback, useState} from 'react';

import {contact, SectionId, socialLinks} from '../../../data/data';
import {ContactType} from '../../../data/dataDef';
import Section from '../../Layout/Section';
import {GradientText} from '../../ui/AnimatedText';
import ContactForm from './ContactForm';

const REQUEST_TYPES = [
  'freelance projects',
  'full-stack development',
  'collaboration',
  'job opportunities',
  'general inquiries',
];

const ContactValueMap = {
  [ContactType.Email]: {Icon: EnvelopeIcon, srLabel: 'Email'},
  [ContactType.Location]: {Icon: MapPinIcon, srLabel: 'Location'},
} as const;

const Contact: FC = memo(() => {
  const {items} = contact;
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const email = items.find(item => item.type === ContactType.Email)?.text ?? '';

  const copyEmail = useCallback(async () => {
    if (!email || copied) return;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the mailto link still works.
    }
  }, [copied, email]);

  const entrance = shouldReduceMotion ? {opacity: 1} : {opacity: 0, y: 28};
  const visible = {opacity: 1, y: 0};
  const viewport = {once: true, amount: 0.2} as const;

  return (
    <Section className="relative overflow-hidden bg-neutral-900" sectionId={SectionId.Contact}>
      {/* Background treatment */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-gradient-glow))] opacity-70" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:56px_56px]" />
      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <motion.div
        animate={shouldReduceMotion ? undefined : {opacity: [0.4, 0.9, 0.4], y: [0, -12, 0]}}
        className="pointer-events-none absolute left-[12%] top-16 hidden h-24 w-24 rounded-full border border-orange-500/20 lg:block"
        transition={{duration: 7, repeat: Infinity, ease: 'easeInOut'}}
      />
      <motion.div
        animate={shouldReduceMotion ? undefined : {opacity: [0.3, 0.8, 0.3], y: [0, 10, 0]}}
        className="pointer-events-none absolute bottom-24 right-[10%] hidden h-16 w-16 rounded-full border border-cyan-500/20 lg:block"
        transition={{duration: 8, repeat: Infinity, ease: 'easeInOut'}}
      />

      <div className="relative z-10 flex flex-col gap-y-12">
        {/* Heading */}
        <motion.div
          animate={visible}
          className="flex flex-col items-center gap-y-3 text-center"
          initial={entrance}
          transition={{duration: 0.7, ease: [0.175, 0.885, 0.32, 1.275]}}
          viewport={viewport}>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Get In Touch</span>
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
            Let&apos;s Build <GradientText>Something Together</GradientText>
          </h2>
          <p className="max-w-2xl text-sm text-neutral-400 sm:text-base">
            Have a project in mind, a role to fill, or just want to say hi? I&apos;m always open to talking about{' '}
            {REQUEST_TYPES.map((item, index) => (
              <span key={item}>
                <span className="text-neutral-200">{item}</span>
                {index < REQUEST_TYPES.length - 1 ? ', ' : '.'}
              </span>
            ))}
            Drop a message and I&apos;ll get back to you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left column — contact details */}
          <motion.div
            animate={visible}
            className="order-2 flex flex-col gap-y-6 lg:order-1"
            initial={entrance}
            transition={{duration: 0.7, delay: 0.15, ease: [0.175, 0.885, 0.32, 1.275]}}
            viewport={viewport}>
            {/* Availability */}
            <div className="flex items-center gap-2 text-sm text-neutral-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>
              <span className="font-medium text-green-400">Available for projects &amp; opportunities</span>
            </div>

            {/* Contact items */}
            <dl className="flex flex-col gap-y-4">
              {items.map(item => {
                const value =
                  item.type === ContactType.Email || item.type === ContactType.Location
                    ? ContactValueMap[item.type]
                    : undefined;
                if (!value) return null;
                const {Icon, srLabel} = value;
                return (
                  <div className="flex items-center gap-3" key={srLabel}>
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                      <Icon aria-hidden="true" className="h-5 w-5 text-orange-500" />
                    </div>
                    <dt className="sr-only">{srLabel}</dt>
                    <dd className="flex min-w-0 flex-1 items-center gap-2">
                      <a
                        className="truncate text-sm text-neutral-200 transition-colors duration-300 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 sm:text-base"
                        href={item.href}
                        rel="noopener noreferrer"
                        target={item.type === ContactType.Email ? undefined : '_blank'}>
                        {item.text}
                      </a>
                      {item.type === ContactType.Email && (
                        <button
                          aria-label={copied ? 'Email copied' : 'Copy email address'}
                          className="group/copy ml-auto shrink-0 rounded-md p-1.5 text-sm text-neutral-400 transition-colors duration-200 hover:bg-white/5 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                          onClick={copyEmail}
                          type="button">
                          {copied ? (
                            <CheckIcon className="h-4 w-4 text-green-400" />
                          ) : (
                            <ClipboardIcon className="h-4 w-4 transition-transform duration-200 group-hover/copy:scale-110" />
                          )}
                          <span className="sr-only">{copied ? 'Email copied' : 'Copy email address'}</span>
                        </button>
                      )}
                    </dd>
                  </div>
                );
              })}
            </dl>

            {/* Response time */}
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ClockIcon className="h-4 w-4" />
              <span>Usually responds within 24–48 hours</span>
            </div>

            {/* Social links */}
            <div className="mt-2 flex items-center gap-3">
              {socialLinks.map(({label, Icon, href}) => (
                <a
                  aria-label={label}
                  className="group relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-neutral-300 transition-all duration-300 hover:border-orange-500/50 hover:bg-orange-500/10 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  href={href}
                  key={label}
                  rel="noopener noreferrer"
                  target="_blank">
                  <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-neutral-800 px-2 py-1 text-[11px] font-medium text-neutral-200 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Right column — form */}
          <motion.div
            animate={visible}
            className="order-1 lg:order-2"
            initial={entrance}
            transition={{duration: 0.7, delay: 0.25, ease: [0.175, 0.885, 0.32, 1.275]}}
            viewport={viewport}>
            <div className="relative">
              <motion.div
                animate={shouldReduceMotion ? undefined : {opacity: [0.35, 0.7, 0.35]}}
                aria-hidden="true"
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-orange-500/25 to-cyan-500/25 blur-lg"
                transition={{duration: 6, repeat: Infinity, ease: 'easeInOut'}}
              />
              <div className="relative rounded-3xl bg-gradient-to-br from-orange-500/40 via-white/10 to-cyan-500/40 p-px">
                <div className="rounded-[calc(1.5rem-1px)] bg-neutral-900/90 p-6 backdrop-blur-sm sm:p-8">
                  <ContactForm />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
});

Contact.displayName = 'Contact';
export default Contact;
