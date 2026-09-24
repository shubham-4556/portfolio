import {CheckIcon, ExclamationTriangleIcon, StarIcon as StarIconOutline} from '@heroicons/react/24/outline';
import {StarIcon as StarIconSolid} from '@heroicons/react/24/solid';
import {FC, memo, useCallback, useState} from 'react';

import {validateTestimonial} from '../../../lib/testimonials/validation';

interface TestimonialFormProps {
  onClose: () => void;
}

interface FormValues {
  name: string;
  email: string;
  role: string;
  company: string;
  linkedinUrl: string;
  profileImage: string;
  rating: number;
  website: string;
  testimonial: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  role?: string;
  company?: string;
  linkedinUrl?: string;
  profileImage?: string;
  rating?: string;
  testimonial?: string;
}

const emptyValues: FormValues = {
  name: '',
  email: '',
  role: '',
  company: '',
  linkedinUrl: '',
  profileImage: '',
  rating: 0,
  website: '',
  testimonial: '',
};

const inputClass = (hasError: boolean): string =>
  `w-full rounded-lg border bg-neutral-900/60 px-3.5 py-2.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors duration-200 focus:ring-2 ${
    hasError
      ? 'border-red-500/60 focus:border-red-500 focus:ring-red-500/20'
      : 'border-white/10 focus:border-orange-500 focus:ring-orange-500/20'
  }`;

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-400';

const TestimonialForm: FC<TestimonialFormProps> = memo(({onClose}) => {
  const [values, setValues] = useState<FormValues>(emptyValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);

  const setField = useCallback((field: keyof FormValues, value: string) => {
    setValues(prev => ({...prev, [field]: value}));
    setErrors(prev => ({...prev, [field]: undefined}));
    setServerMessage(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setServerMessage(null);

      if (values.website) {
        setSuccess(true);
        return;
      }

      const result = validateTestimonial(values);
      if (!result.ok || !result.value) {
        setErrors((result.errors ?? {}) as FormErrors);
        return;
      }

      setSubmitting(true);
      try {
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(result.value),
        });
        const payload = (await response.json()) as {success: boolean; errors?: FormErrors; message?: string};
        if (!response.ok) {
          if (payload.errors) setErrors(payload.errors);
          setServerMessage(
            payload.message ??
              (response.status === 429
                ? 'Too many submissions. Please try again later.'
                : 'Something went wrong. Please try again.'),
          );
          return;
        }
        setSuccess(true);
      } catch {
        setServerMessage('Network error. Please check your connection and try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [values],
  );

  if (success) {
    return (
      <div className="flex flex-col items-center gap-5 py-8 text-center">
        <MotionCheck />
        <div>
          <h3 className="text-xl font-extrabold text-white">Thank you!</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-400">
            Your testimonial has been submitted successfully and will be reviewed before being published.
          </p>
        </div>
        <button
          className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          onClick={onClose}
          type="button">
          Close
        </button>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 py-1" noValidate onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field error={errors.name} label="Full name *">
          <input
            aria-invalid={Boolean(errors.name)}
            className={inputClass(Boolean(errors.name))}
            maxLength={80}
            onChange={event => setField('name', event.target.value)}
            placeholder="Jane Doe"
            type="text"
            value={values.name}
          />
        </Field>
        <Field error={errors.email} label="Email *">
          <input
            aria-invalid={Boolean(errors.email)}
            autoComplete="email"
            className={inputClass(Boolean(errors.email))}
            maxLength={160}
            onChange={event => setField('email', event.target.value)}
            placeholder="jane@company.com"
            type="email"
            value={values.email}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field error={errors.role} label="Role / Designation *">
          <input
            aria-invalid={Boolean(errors.role)}
            className={inputClass(Boolean(errors.role))}
            maxLength={100}
            onChange={event => setField('role', event.target.value)}
            placeholder="Product Manager"
            type="text"
            value={values.role}
          />
        </Field>
        <Field error={errors.company} label="Company">
          <input
            aria-invalid={Boolean(errors.company)}
            className={inputClass(Boolean(errors.company))}
            maxLength={100}
            onChange={event => setField('company', event.target.value)}
            placeholder="Acme Inc."
            type="text"
            value={values.company}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field error={errors.linkedinUrl} label="LinkedIn URL">
          <input
            aria-invalid={Boolean(errors.linkedinUrl)}
            className={inputClass(Boolean(errors.linkedinUrl))}
            maxLength={2048}
            onChange={event => setField('linkedinUrl', event.target.value)}
            placeholder="https://www.linkedin.com/in/janedoe"
            type="url"
            value={values.linkedinUrl}
          />
        </Field>
        <Field error={errors.profileImage} label="Profile image URL">
          <input
            aria-invalid={Boolean(errors.profileImage)}
            className={inputClass(Boolean(errors.profileImage))}
            maxLength={2048}
            onChange={event => setField('profileImage', event.target.value)}
            placeholder="https://example.com/avatar.jpg"
            type="url"
            value={values.profileImage}
          />
        </Field>
      </div>

      <Field error={errors.rating} label="Rating">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map(star => {
            const active = (hoverRating || values.rating) >= star;
            return (
              <button
                aria-label={`${star} star${star > 1 ? 's' : ''}`}
                className="rounded-md p-0.5 transition-transform duration-150 hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                key={`rating-${star}`}
                onClick={() => setField('rating', String(star))}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                type="button">
                {active ? (
                  <StarIconSolid className="h-6 w-6 text-orange-400" />
                ) : (
                  <StarIconOutline className="h-6 w-6 text-white/25" />
                )}
              </button>
            );
          })}
        </div>
      </Field>

      <Field error={errors.testimonial} label="Testimonial *">
        <textarea
          aria-invalid={Boolean(errors.testimonial)}
          className={inputClass(Boolean(errors.testimonial))}
          maxLength={2000}
          onChange={event => setField('testimonial', event.target.value)}
          placeholder="Tell others about your experience working together…"
          rows={4}
          value={values.testimonial}
        />
      </Field>

      {/* Honeypot — hidden from humans, filled only by bots */}
      <input
        aria-hidden="true"
        autoComplete="off"
        className="absolute -left-[9999px] h-0 w-0"
        onChange={event => setField('website', event.target.value)}
        tabIndex={-1}
        type="text"
        value={values.website}
      />

      {serverMessage && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
          <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{serverMessage}</span>
        </div>
      )}

      <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-neutral-500">Your email is only used for moderation and will never be published.</p>
        <button
          className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:from-orange-600 hover:to-orange-700 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          disabled={submitting}
          type="submit">
          {submitting ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Submitting…
            </>
          ) : (
            'Submit Testimonial'
          )}
        </button>
      </div>
    </form>
  );
});

const Field: FC<{label: string; error?: string; children: React.ReactNode}> = memo(({label, error, children}) => (
  <label className="block">
    <span className={labelClass}>{label}</span>
    {children}
    {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
  </label>
));

Field.displayName = 'Field';

const MotionCheck: FC = memo(() => (
  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 shadow-lg shadow-orange-500/25">
    <CheckIcon className="h-8 w-8 text-white" />
  </div>
));
MotionCheck.displayName = 'MotionCheck';

TestimonialForm.displayName = 'TestimonialForm';
export default TestimonialForm;
