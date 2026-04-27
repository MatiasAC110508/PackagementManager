import Link from "next/link";
import Alert from "@/components/ui/Alert";
import AppButton from "@/components/ui/AppButton";
import AppLogo from "@/components/ui/AppLogo";
import type { ShipmentSummary } from "@/types/shipment";
import type { FeedbackState } from "@/components/dashboard/dashboard.types";

type DashboardHeroProps = {
  feedback: FeedbackState;
  loadingBoard: boolean;
  onLogout: () => void | Promise<void>;
  sessionEmail: string;
  summary: ShipmentSummary;
};

const summaryCards = [
  { key: "total", label: "Total shipments" },
  { key: "pending", label: "Pending" },
  { key: "inTransit", label: "In transit" },
  { key: "delivered", label: "Delivered" },
] as const;

export default function DashboardHero({
  feedback,
  loadingBoard,
  onLogout,
  sessionEmail,
  summary,
}: DashboardHeroProps) {
  return (
    <div className="surface-panel rounded-[2.4rem] p-6 sm:p-8 animate-fade-up">
      <div className="flex flex-col gap-6 border-b border-[var(--line)] pb-8 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-5">
          <AppLogo />
          <div className="space-y-3">
            <p className="section-label text-xs">Operations dashboard</p>
            <h1 className="text-4xl font-semibold leading-tight text-[color:var(--foreground)] sm:text-[3.25rem]">
              Absolute control over
              <br />
              every heavy shipment.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-[color:var(--muted)]">
              Manage origin, destination, company, client, delivery state,
              live status changes, and client notifications from one connected
              shipping workspace.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <div className="rounded-[1.35rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm text-[color:var(--foreground)]">
            Signed in as <span className="font-semibold">{sessionEmail}</span>
          </div>
          <div
            className={`rounded-[1.35rem] px-4 py-3 text-sm ${
              loadingBoard
                ? "border border-amber-200/70 bg-amber-100 text-amber-900"
                : "border border-emerald-200/70 bg-emerald-100 text-emerald-900"
            }`}
          >
            {loadingBoard
              ? "Syncing with the shipment API"
              : "Connected to the live shipment API"}
          </div>
          <div className="rounded-[1.35rem] border border-[var(--line)] bg-white/72 px-4 py-3 text-sm text-[color:var(--foreground)]">
            Auto-refresh every 10 seconds
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-[1.2rem] border border-[var(--line)] bg-white/72 px-4 py-3 text-sm font-semibold text-[color:var(--foreground)] hover:bg-white"
            >
              Back to landing
            </Link>
            <AppButton
              className="px-4 py-3"
              variant="secondary"
              onClick={onLogout}
            >
              Sign out
            </AppButton>
          </div>
        </div>
      </div>

      {feedback ? (
        <div className="mt-6">
          <Alert variant={feedback.variant}>{feedback.text}</Alert>
        </div>
      ) : null}

      <div className="mt-8 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <article
            key={card.key}
            className="rounded-[1.6rem] border border-[var(--line)] bg-white/74 p-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {card.label}
            </p>
            <p className="mt-3 text-3xl font-semibold text-[color:var(--foreground)]">
              {summary[card.key]}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
