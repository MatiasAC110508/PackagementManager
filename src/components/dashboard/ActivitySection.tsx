import { formatDateTime } from "@/components/dashboard/dashboard.utils";
import type { ShipmentActivity } from "@/types/shipment";

type ActivitySectionProps = {
  activity: ShipmentActivity[];
};

export default function ActivitySection({ activity }: ActivitySectionProps) {
  return (
    <section className="surface-panel rounded-[2.2rem] p-6 sm:p-7 animate-fade-up-delay">
      <div className="border-b border-[var(--line)] pb-5">
        <p className="section-label text-xs">Latest activity</p>
        <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
          Operations feed
        </h2>
      </div>

      <div className="mt-6 grid gap-3">
        {activity.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-white/62 px-5 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            Activity entries will appear here after the first shipment event.
          </div>
        ) : (
          activity.map((entry) => (
            <article
              key={entry.id}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-4"
            >
              <p className="text-sm font-semibold text-[color:var(--foreground)]">
                {entry.title}
              </p>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                {entry.detail}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                {formatDateTime(entry.timestamp)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
