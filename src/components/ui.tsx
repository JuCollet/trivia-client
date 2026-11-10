import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';

import { useLanguageStore } from '@/i18n/language';
import { cx } from '@/lib/cx';
import { avatarUrl } from '@/session/avatars';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' };

export function Button({ variant = 'primary', className, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        'rounded-2xl px-5 py-3.5 text-lg font-semibold transition active:scale-[0.97] disabled:opacity-50 disabled:active:scale-100',
        // Slightly domed and matte, like the TV buttons
        variant === 'primary' &&
          'bg-linear-to-b from-[#ffd968] to-[#ffc12a] text-night shadow-[inset_0_1px_0_rgb(255_255_255/0.5),inset_0_-3px_0_rgb(0_0_0/0.12),0_4px_12px_rgb(0_0_0/0.25)]',
        variant === 'secondary' &&
          'bg-linear-to-b from-[#2d38a6] to-surface-raised text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),inset_0_-3px_0_rgb(0_0_0/0.15),0_4px_12px_rgb(0_0_0/0.25)]',
        variant === 'ghost' && 'text-muted underline-offset-4 hover:underline',
        className,
      )}
      {...props}
    />
  );
}

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
};

export function TextField({ label, hint, error, id, className, ...props }: TextFieldProps) {
  const inputId = id ?? props.name;
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-muted">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        className={cx(
          'rounded-xl border-2 bg-white/95 px-4 py-3 text-lg text-night outline-none placeholder:text-slate-400 focus:border-accent',
          error ? 'border-danger' : 'border-transparent',
          className,
        )}
        {...props}
      />
      {error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cx('rounded-3xl bg-panel p-5 shadow-lg ring-1 ring-panel-border backdrop-blur', className)}>
      {children}
    </div>
  );
}

export function Logo({ className }: { className?: string }) {
  const language = useLanguageStore((state) => state.language);
  return (
    <img
      src={`/images/logo-${language}.png`}
      alt={language === 'fr' ? 'Chacun son truc' : 'To Each Their Thing'}
      className={cx('mx-auto w-full max-w-xs drop-shadow-xl', className)}
    />
  );
}

export function PlayerChip({ name, avatar, dimmed }: { name: string; avatar: string; dimmed?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-2 rounded-full bg-white/10 py-1 pr-3 pl-1 text-sm font-medium',
        dimmed && 'opacity-50',
      )}
    >
      <img src={avatarUrl(avatar)} alt="" className="size-6 rounded-full bg-night" />
      {name}
    </span>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        'inline-block size-8 animate-spin rounded-full border-4 border-white/20 border-t-accent',
        className,
      )}
    />
  );
}
