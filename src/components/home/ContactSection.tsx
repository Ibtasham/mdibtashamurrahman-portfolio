import { useState, type FormEvent } from 'react';
import {
  ArrowUpRight,
  Building2,
  Check,
  Copy,
  FileDown,
  Lock,
  Mail,
  MapPin,
  Send,
} from 'lucide-react';
import { PROFILE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  buildMailtoHref,
  validateContactForm,
  type ContactFormInput,
} from '../../utils/portfolioFilters';
import { Button, ExternalLinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';

const INPUT_CLASS =
  'w-full rounded-[10px] border border-wood-default dark:border-slate-800 bg-wood-input dark:bg-[#060b16] px-3.5 py-2.5 text-sm text-wood-ink dark:text-slate-100 placeholder:text-wood-muted/70 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600/40 dark:focus-visible:ring-cyan-400/70';

export function ContactSection() {
  const [form, setForm] = useState<ContactFormInput>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormInput, string>>
  >({});
  const [submittedHref, setSubmittedHref] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  const handleFieldChange = (field: keyof ContactFormInput, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (submittedHref) {
      setSubmittedHref(null);
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopiedEmail(false);
    }
  };

  const handleCopyInquiry = async () => {
    const formatted = [
      `To: ${PROFILE.email}`,
      `From: ${form.name} <${form.email}>`,
      `Subject: ${form.subject}`,
      '',
      form.message,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedInquiry(true);
      window.setTimeout(() => setCopiedInquiry(false), 2000);
    } catch {
      setCopiedInquiry(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateContactForm(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmittedHref(null);
      return;
    }

    setErrors({});
    const href = buildMailtoHref(PROFILE.email, form);
    setSubmittedHref(href);
  };

  return (
    <section
      id="contact"
      className={`relative bg-wood-canvas dark:bg-[#050914] ${DESIGN_TOKENS.spacing.sectionY}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-section-light"
      />
      <div
        className={`relative ${DESIGN_TOKENS.spacing.container} ${DESIGN_TOKENS.spacing.sectionStack}`}
      >
        <SectionHeading
          index="08"
          eyebrow="Collaboration & Inquiries"
          title="Get in Touch"
          description="Open to research collaboration, industrial engineering projects, internship opportunities, and campus or inter-university initiatives."
        />

        <SectionReveal>
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-5">
              <SurfaceCard className="p-6 space-y-5">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Direct Channels
                  </p>
                  <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                    Contact Information
                  </h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-3.5">
                    <div className="flex min-w-0 items-start gap-3">
                      <Mail
                        className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400"
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <p className="text-xs text-wood-muted dark:text-slate-400">
                          Email
                        </p>
                        <a
                          href={`mailto:${PROFILE.email}`}
                          className="break-all font-mono text-xs text-wood-ink dark:text-slate-100 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
                        >
                          {PROFILE.email}
                        </a>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleCopyEmail}
                      aria-label={`Copy ${PROFILE.email} to clipboard`}
                      className="!min-h-[38px] sm:!min-h-[32px] !px-3 sm:!px-2.5 !py-1 !rounded-[8px]"
                    >
                      {copiedEmail ? (
                        <>
                          <Check
                            className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
                            aria-hidden="true"
                          />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="flex items-start gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-3.5">
                    <Building2
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-wood-muted dark:text-slate-400">
                        Academic Affiliation
                      </p>
                      <p className="text-xs font-medium text-wood-ink dark:text-slate-100">
                        {PROFILE.academicBase}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-3.5">
                    <MapPin
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-wood-muted dark:text-slate-400">
                        Region
                      </p>
                      <p className="text-xs text-wood-walnut dark:text-slate-200">
                        {PROFILE.publicLocation} · Origin: {PROFILE.locationPermanent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-3.5">
                    <Lock
                      className="mt-0.5 h-4 w-4 shrink-0 text-wood-muted dark:text-slate-400"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-xs text-wood-muted dark:text-slate-400">
                        Contact Privacy
                      </p>
                      <p className="text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                        {PROFILE.privacyNote}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    <ExternalLinkButton
                      href={PROFILE.links.cvPdf}
                      download="MD_Ibtashamur_Rahman_CV.pdf"
                      variant="primary"
                      size="sm"
                    >
                      <FileDown className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Download CV (PDF)</span>
                    </ExternalLinkButton>
                    <ExternalLinkButton
                      href={PROFILE.links.linkedin}
                      variant="secondary"
                      size="sm"
                    >
                      <span>LinkedIn</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </ExternalLinkButton>
                    <ExternalLinkButton
                      href={PROFILE.links.github}
                      variant="secondary"
                      size="sm"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </ExternalLinkButton>
                  </div>
                </div>
              </SurfaceCard>
            </div>

            <div className="lg:col-span-7">
              <SurfaceCard className="p-6">
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-wood-walnut dark:text-slate-300"
                      >
                        Full Name
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={form.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        placeholder="Your name"
                        className={INPUT_CLASS}
                      />
                      {errors.name && (
                        <p
                          id="contact-name-error"
                          className="text-xs text-rose-600 dark:text-rose-400"
                          role="alert"
                        >
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label
                        htmlFor="contact-email"
                        className="block text-xs font-medium text-wood-walnut dark:text-slate-300"
                      >
                        Email Address
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={form.email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={
                          errors.email ? 'contact-email-error' : undefined
                        }
                        placeholder="you@organization.com"
                        className={INPUT_CLASS}
                      />
                      {errors.email && (
                        <p
                          id="contact-email-error"
                          className="text-xs text-rose-600 dark:text-rose-400"
                          role="alert"
                        >
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-subject"
                      className="block text-xs font-medium text-wood-walnut dark:text-slate-300"
                    >
                      Subject
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={form.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      aria-invalid={Boolean(errors.subject)}
                      aria-describedby={
                        errors.subject ? 'contact-subject-error' : undefined
                      }
                      placeholder="Research collaboration, internship, or campus initiative"
                      className={INPUT_CLASS}
                    />
                    {errors.subject && (
                      <p
                        id="contact-subject-error"
                        className="text-xs text-rose-600 dark:text-rose-400"
                        role="alert"
                      >
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-wood-walnut dark:text-slate-300"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => handleFieldChange('message', e.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={
                        errors.message ? 'contact-message-error' : undefined
                      }
                      placeholder="Share details regarding your inquiry or collaboration..."
                      className={INPUT_CLASS}
                    />
                    {errors.message && (
                      <p
                        id="contact-message-error"
                        className="text-xs text-rose-600 dark:text-rose-400"
                        role="alert"
                      >
                        {errors.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                    <Button type="submit" variant="primary" size="md">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Prepare Inquiry</span>
                    </Button>

                    <span className="font-mono text-xs text-wood-muted dark:text-slate-400">
                      Direct to {PROFILE.email}
                    </span>
                  </div>

                  {submittedHref && (
                    <div
                      role="status"
                      className="rounded-[10px] border border-cyan-600/35 dark:border-cyan-500/40 bg-cyan-100/60 dark:bg-cyan-500/10 p-4 text-xs text-cyan-950 dark:text-cyan-100 space-y-3"
                    >
                      <p className="font-medium">
                        Inquiry validated and ready for {form.name}.
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        <a
                          href={submittedHref}
                          className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 py-1.5 sm:py-0 font-semibold text-cyan-700 dark:text-cyan-300 underline underline-offset-4 hover:text-cyan-900 dark:hover:text-cyan-200"
                        >
                          <span>Open in Default Mail Client</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>

                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={handleCopyInquiry}
                          className="!min-h-[38px] sm:!min-h-[32px] !px-3 sm:!px-2.5 !py-1 !rounded-[8px]"
                        >
                          {copiedInquiry ? (
                            <>
                              <Check
                                className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
                                aria-hidden="true"
                              />
                              <span>Copied Summary</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Copy Inquiry Summary</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </form>
              </SurfaceCard>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
