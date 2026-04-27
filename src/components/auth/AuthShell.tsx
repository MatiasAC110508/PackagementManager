import type { ReactNode } from "react";
import AppLogo from "@/components/ui/AppLogo";

type AuthShellProps = {
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

const authHighlights = [
  {
    title: "Permits",
    description: "Oversized route requirements in one place.",
  },
  {
    title: "Tracking",
    description: "Clear shipment updates for clients and operators.",
  },
  {
    title: "Documents",
    description: "Quotes, notes, and delivery records stay aligned.",
  },
] as const;

const authSteps = [
  "Access your freight portal.",
  "Review routes, notes, and status updates.",
  "Keep clients and delivery teams aligned.",
] as const;

export default function AuthShell({
  children,
  description,
  footer,
  title,
}: AuthShellProps) {
  return (
    <section className="grid w-full gap-4 lg:grid-cols-[minmax(0,1.04fr)_minmax(23rem,0.96fr)]">
      <div className="surface-panel order-2 relative overflow-hidden rounded-[2.4rem] p-6 sm:p-8 animate-fade-up lg:order-1">
        <div className="absolute -left-12 top-8 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />

        <div className="relative flex h-full items-center">
          <div className="flex w-full flex-col gap-8">
            <div className="flex justify-center lg:justify-start">
              <AppLogo />
            </div>

            <div className="space-y-4">
              <p className="section-label text-xs">Heavy Cargo Portal</p>
              <h2 className="max-w-2xl text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[3.1rem]">
                Keep every heavy move
                <br />
                calm, visible, and documented.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-[color:var(--muted)]">
                Built for clients, brokers, and operations teams handling oversized freight,
                industrial cargo, and route-sensitive deliveries.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {authHighlights.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[1.45rem] border border-[var(--line)] bg-white/70 p-5"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]">
                    {item.title}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>

            <div className="grid gap-4 rounded-[1.8rem] border border-[var(--line)] bg-white/68 p-5">
              <div className="space-y-2">
                <p className="section-label text-xs">Portal Flow</p>
                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  Minimal steps from account access to freight visibility.
                </p>
              </div>

              <div className="grid gap-3">
                {authSteps.map((step, index) => (
                  <div
                    key={step}
                    className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-3"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--foreground)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.35rem] border border-[var(--line)] bg-[#1c1b19] px-4 py-4 text-sm leading-6 text-white/78">
                One secure space for route approvals, shipment notes, and delivery updates.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="surface-panel-strong order-1 relative flex flex-col overflow-hidden rounded-[2.4rem] p-6 sm:p-8 animate-fade-up-delay lg:order-2">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[var(--accent-soft)] blur-3xl" />

        <div className="relative flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6">
            <div className="space-y-3 text-center lg:text-left">
              <p className="section-label text-xs">Client Access</p>
              <h1 className="text-3xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[2.75rem]">
                {title}
              </h1>
              <p className="max-w-lg text-sm leading-7 text-[color:var(--muted)]">
                {description}
              </p>
            </div>

            <div className="rounded-[1.8rem] border border-[var(--line)] bg-white/72 p-5 sm:p-6">
              <div className="mb-5 space-y-2 text-center lg:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Form
                </p>
                <p className="text-sm leading-6 text-[color:var(--muted)]">
                  Only the fields needed to open your portal.
                </p>
              </div>

              <div>{children}</div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 border-t border-[var(--line)] pt-5 text-center text-xs text-[color:var(--muted)] lg:text-left">
          {footer}
        </div>
      </div>
    </section>
  );
}
