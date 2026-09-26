import {CheckIcon, ExclamationTriangleIcon, PaperAirplaneIcon} from '@heroicons/react/24/outline';
import {motion, useAnimationControls, useReducedMotion} from 'framer-motion';
import {FC, memo, useCallback, useMemo, useRef, useState} from 'react';

interface FormValues {
  name: string;
  email: string;
  company: string;
  subject: string;
  message: string;
  website: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  subject?: string;
  message?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
}

type FormStatus = 'idle' | 'sending' | 'success' | 'error';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputClass = (hasError: boolean): string =>
  `w-full rounded-lg border bg-neutral-900/60 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors duration-200 focus:ring-2 ${
    hasError
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
      : 'border-white/10 focus:border-orange-500 focus:ring-orange-500/20'
  }`;

const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400 transition-colors duration-200 group-focus-within:text-orange-400';

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = 'Please enter your name.';
  if (!values.email.trim()) errors.email = 'Please enter your email address.';
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Please enter a valid email address.';
  if (!values.subject.trim()) errors.subject = 'Please enter a subject.';
  if (!values.message.trim()) errors.message = 'Please write a message.';
  else if (values.message.trim().length < 10) errors.message = 'Your message is too short.';
  return errors;
}

const ContactForm: FC = memo(() => {
  const defaultValues = useMemo(() => ({name: '', email: '', company: '', subject: '', message: '', website: ''}), []);

  const [values, setValues] = useState<FormValues>(defaultValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const submittingRef = useRef(false);
  const shouldReduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  const setField = useCallback((field: Exclude<keyof FormValues, 'website'>, value: string) => {
    setValues(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: undefined}));
    setServerMessage(null);
  }, []);

  const setHoneypot = useCallback((value: string) => {
    setValues(prev => ({...prev, website: value}));
  }, []);

  const shake = useCallback(() => {
    if (!shouldReduceMotion) {
      controls.start({x: [0, -8, 8, -5, 5, 0], transition: {duration: 0.45, ease: 'easeInOut'}});
    }
  }, [controls, shouldReduceMotion]);

  const resetForm = useCallback(() => {
    setValues(defaultValues);
    setErrors({});
    setServerMessage(null);
    setStatus('idle');
  }, [defaultValues]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submittingRef.current || status === 'sending') return;

      // Honeypot — filled only by bots; pretend success without sending.
      if (values.website) {
        setStatus('success');
        return;
      }

      const nextErrors = validate(values);
      if (Object.keys(nextErrors).length > 0) {
        setErrors(nextErrors);
        setStatus('error');
        shake();
        return;
      }

      submittingRef.current = true;
      setStatus('sending');
      setServerMessage(null);

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify({
            name: values.name.trim(),
            email: values.email.trim(),
            company: values.company.trim(),
            subject: values.subject.trim(),
            message: values.message.trim(),
            website: values.website,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as ApiResponse;

        if (!response.ok || !payload.success) {
          setErrors((payload.errors ?? {}) as FormErrors);
          setServerMessage(payload.message ?? 'Could not send your message. Please try again.');
          setStatus('error');
          shake();
          return;
        }

        setErrors({});
        setStatus('success');
      } catch {
        setServerMessage('Network error. Please check your connection and try again.');
        setStatus('error');
        shake();
      } finally {
        submittingRef.current = false;
      }
    },
    [shake, status, values],
  );

  if (status === 'success') {
    return (
      <motion.div
        animate={{opacity: 1, scale: 1}}
        aria-live="polite"
        className="flex min-h-[320px] flex-col items-center justify-center gap-5 text-center"
        initial={{opacity: 0, scale: 0.9}}
        transition={{duration: 0.4, ease: [0.175, 0.885, 0.32, 1.275]}}>
        <motion.div
          animate={{rotate: [0, 12, -8, 0], scale: [0.6, 1.15, 1]}}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 shadow-lg shadow-orange-500/25"
          transition={{duration: 0.6, ease: 'easeOut'}}>
          <CheckIcon className="h-8 w-8 text-white" />
        </motion.div>
        <div>
          <h3 className="text-xl font-extrabold text-white">Message sent successfully!</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">
            Thanks for reaching out. I&apos;ll get back to you soon.
          </p>
        </div>
        <button
          className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-neutral-200 transition-all duration-300 hover:border-orange-500/50 hover:text-orange-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
          onClick={resetForm}
          type="button">
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      animate={controls}
      aria-describedby={serverMessage ? 'contact-form-status' : undefined}
      className="flex flex-col gap-4"
      noValidate
      onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group">
          <label className={labelClass} htmlFor="contact-name">
            Full name *
          </label>
          <input
            aria-describedby={errors.name ? 'contact-error-name' : undefined}
            aria-invalid={Boolean(errors.name)}
            autoComplete="name"
            className={inputClass(Boolean(errors.name))}
            id="contact-name"
            maxLength={100}
            onChange={event => setField('name', event.target.value)}
            placeholder="Jane Doe"
            type="text"
            value={values.name}
          />
          {errors.name && (
            <span className="mt-1 block text-xs text-red-400" id="contact-error-name" role="alert">
              {errors.name}
            </span>
          )}
        </div>
        <div className="group">
          <label className={labelClass} htmlFor="contact-email">
            Email address *
          </label>
          <input
            aria-describedby={errors.email ? 'contact-error-email' : undefined}
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={inputClass(Boolean(errors.email))}
            id="contact-email"
            maxLength={160}
            onChange={event => setField('email', event.target.value)}
            placeholder="jane@company.com"
            type="email"
            value={values.email}
          />
          {errors.email && (
            <span className="mt-1 block text-xs text-red-400" id="contact-error-email" role="alert">
              {errors.email}
            </span>
          )}
        </div>
      </div>

      <div className="group">
        <label className={labelClass} htmlFor="contact-subject">
          Subject *
        </label>
        <input
          aria-describedby={errors.subject ? 'contact-error-subject' : undefined}
          aria-invalid={Boolean(errors.subject)}
          className={inputClass(Boolean(errors.subject))}
          id="contact-subject"
          maxLength={200}
          onChange={event => setField('subject', event.target.value)}
          placeholder="Freelance project enquiry"
          type="text"
          value={values.subject}
        />
        {errors.subject && (
          <span className="mt-1 block text-xs text-red-400" id="contact-error-subject" role="alert">
            {errors.subject}
          </span>
        )}
      </div>

      <div className="group">
        <label className={labelClass} htmlFor="contact-company">
          Company / Organization
        </label>
        <input
          autoComplete="organization"
          className={inputClass(Boolean(errors.company))}
          id="contact-company"
          maxLength={200}
          onChange={event => setField('company', event.target.value)}
          placeholder="Acme Inc. (optional)"
          type="text"
          value={values.company}
        />
        {errors.company && (
          <span className="mt-1 block text-xs text-red-400" id="contact-error-company" role="alert">
            {errors.company}
          </span>
        )}
      </div>

      <div className="group">
        <label className={labelClass} htmlFor="contact-message">
          Message *
        </label>
        <textarea
          aria-describedby={errors.message ? 'contact-error-message' : undefined}
          aria-invalid={Boolean(errors.message)}
          className={inputClass(Boolean(errors.message))}
          id="contact-message"
          maxLength={5000}
          onChange={event => setField('message', event.target.value)}
          placeholder="Tell me about your project or opportunity…"
          rows={5}
          value={values.message}
        />
        {errors.message && (
          <span className="mt-1 block text-xs text-red-400" id="contact-error-message" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot — hidden from humans, filled only by bots */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0"
        onChange={event => setHoneypot(event.target.value)}
        tabIndex={-1}
        type="text"
        value={values.website}
      />

      {serverMessage && (
        <div
          aria-live="assertive"
          className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300"
          id="contact-form-status"
          role="alert">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverMessage}</span>
        </div>
      )}

      <motion.button
        aria-label="Send message"
        className="group/btn mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 sm:w-max"
        disabled={status === 'sending'}
        type="submit"
        whileTap={status === 'sending' ? undefined : {scale: 0.97}}>
        {status === 'sending' ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <PaperAirplaneIcon className="h-4 w-4 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </>
        )}
      </motion.button>
    </motion.form>
  );
});

ContactForm.displayName = 'ContactForm';
export default ContactForm;
