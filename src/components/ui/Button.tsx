import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2563eb] text-white border border-blue-600/80 dark:border-blue-500/40 hover:bg-[#1d4ed8] dark:hover:bg-[#3b82f6] shadow-[0_1px_2px_rgba(45,28,12,0.2)] dark:shadow-[0_1px_2px_rgba(2,6,23,0.5)]',
  secondary:
    'bg-wood-surface dark:bg-[#0b1222] text-wood-ink dark:text-slate-200 border border-wood-default dark:border-slate-700/80 hover:border-blue-600/70 hover:bg-wood-hover dark:hover:bg-[#101a30] hover:text-wood-ink dark:hover:text-white',
  ghost:
    'bg-transparent text-wood-walnut dark:text-slate-300 border border-transparent hover:bg-wood-inset/65 dark:hover:bg-[#101a30]/70 hover:text-blue-700 dark:hover:text-cyan-200',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'min-h-[38px] px-4 py-2 text-xs',
  md: 'min-h-[42px] px-5 py-2.5 text-sm',
};

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-[10px] font-semibold transition-all duration-150 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-wood-canvas dark:focus-visible:ring-offset-[#050914] disabled:pointer-events-none disabled:opacity-60 whitespace-nowrap shrink-0 cursor-pointer';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}

interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
}

export function LinkButton({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

interface ExternalLinkButtonProps {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  download?: boolean | string;
  children: ReactNode;
}

export function ExternalLinkButton({
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  download,
  children,
}: ExternalLinkButtonProps) {
  return (
    <a
      href={href}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noreferrer'}
      download={download}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
    >
      {children}
    </a>
  );
}
