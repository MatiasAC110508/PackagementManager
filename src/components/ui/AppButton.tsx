import type { ButtonHTMLAttributes, ReactNode } from "react";

type AppButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
};

const variantClasses = {
  primary:
    "bg-[#1a1917] text-white shadow-[0_14px_36px_rgba(24,22,19,0.14)] hover:bg-[#2a2926]",
  secondary:
    "border border-[var(--line)] bg-white/72 text-[color:var(--foreground)] hover:bg-white",
  ghost:
    "border border-transparent bg-transparent text-[color:var(--muted)] hover:border-[var(--line)] hover:bg-white/70 hover:text-[color:var(--foreground)]",
};

export default function AppButton({
  children,
  className = "",
  disabled,
  fullWidth = false,
  type = "button",
  variant = "primary",
  ...props
}: AppButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-[1.2rem] px-5 py-3 text-sm font-semibold ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className} disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-[rgba(212,114,48,0.14)]`}
      {...props}
    >
      {children}
    </button>
  );
}
