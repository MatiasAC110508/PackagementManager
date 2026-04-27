import type { ReactNode } from "react";

type AlertProps = {
  children: ReactNode;
  variant?: "error" | "success" | "info" | "warning";
};

const variantStyles = {
  error:
    "border border-red-200 bg-red-50 text-red-900",
  success:
    "border border-green-200 bg-green-50 text-green-900",
  info: "border border-blue-200 bg-blue-50 text-blue-900",
  warning:
    "border border-yellow-200 bg-yellow-50 text-yellow-900",
};

export default function Alert({
  children,
  variant = "error",
}: AlertProps) {
  return (
    <div
      className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm ${variantStyles[variant]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-1">{children}</div>
    </div>
  );
}
