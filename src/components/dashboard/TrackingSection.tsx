import {
  formatRelativeTime,
  statusPillClass,
} from "@/components/dashboard/dashboard.utils";
import { toShipmentStatusLabel, type Shipment } from "@/types/shipment";

type TrackingSectionProps = {
  now: number;
  shipments: Shipment[];
};

export default function TrackingSection({
  now,
  shipments,
}: TrackingSectionProps) {
  return (
    <section className="surface-panel-strong rounded-[2.2rem] p-6 sm:p-7 animate-fade-up">
      <div className="flex items-end justify-between gap-4 border-b border-[var(--line)] pb-5">
        <div>
          <p className="section-label text-xs">Live tracking</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Status stream
          </h2>
        </div>
        <span className="rounded-full border border-emerald-200/70 bg-emerald-100 px-3 py-2 text-xs font-semibold text-emerald-900">
          Database-backed
        </span>
      </div>

      <div className="mt-6 grid gap-3">
        {shipments.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-white/62 px-5 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            Status cards will appear here as soon as the first shipment is created.
          </div>
        ) : (
          shipments.map((shipment) => (
            <article
              key={shipment.id}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {shipment.reference}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
                    {shipment.origin} to {shipment.destination}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusPillClass(
                    shipment.status
                  )}`}
                >
                  {toShipmentStatusLabel(shipment.status)}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Last movement {formatRelativeTime(shipment.updatedAt, now)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
