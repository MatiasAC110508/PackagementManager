import {
  formatRelativeTime,
  statusPillClass,
} from "@/components/dashboard/dashboard.utils";
import {
  toShipmentStatusLabel,
  type ClientNotification,
} from "@/types/shipment";

type NotificationsSectionProps = {
  notifications: ClientNotification[];
  now: number;
};

export default function NotificationsSection({
  notifications,
  now,
}: NotificationsSectionProps) {
  return (
    <section className="surface-panel rounded-[2.2rem] p-6 sm:p-7 animate-fade-up-delay">
      <div className="border-b border-[var(--line)] pb-5">
        <p className="section-label text-xs">Client notifications</p>
        <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
          Status messages ready to send
        </h2>
      </div>

      <div className="mt-6 grid gap-3">
        {notifications.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-[var(--line)] bg-white/62 px-5 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            Client notifications are generated automatically when a shipment status changes.
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className="rounded-[1.5rem] border border-[var(--line)] bg-white/72 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[color:var(--foreground)]">
                    {notification.client}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                    {notification.message}
                  </p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${statusPillClass(
                    notification.status
                  )}`}
                >
                  {toShipmentStatusLabel(notification.status)}
                </span>
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Logged {formatRelativeTime(notification.timestamp, now)}
              </p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
