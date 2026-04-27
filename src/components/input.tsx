import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

export default function Input({
  hint,
  label,
  className = "",
  id,
  ...props
}: Props) {
  const inputId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <label
      className="flex w-full flex-col gap-2 text-sm text-[color:var(--foreground)]"
      htmlFor={inputId}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
        {label}
      </span>

      <input
        id={inputId}
        aria-label={label}
        aria-describedby={hint ? `${inputId}-hint` : undefined}
        className={`w-full rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm text-[color:var(--foreground)] outline-none placeholder:text-[rgba(24,22,19,0.34)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)] ${className}`}
        {...props}
      />

      {hint ? (
        <span
          id={`${inputId}-hint`}
          className="text-xs leading-5 text-[color:var(--muted)]"
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}
