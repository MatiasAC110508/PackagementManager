import AppButton from "@/components/ui/AppButton";
import { statusPillClass } from "@/components/dashboard/dashboard.utils";
import { toShipmentStatusLabel, type Shipment } from "@/types/shipment";

type ReceiptSectionProps = {
  onOpenReceipt: () => void;
  selectedShipment: Shipment | null;
};

export default function ReceiptSection({
  onOpenReceipt,
  selectedShipment,
}: ReceiptSectionProps) {
  return (
    <section className="surface-panel rounded-[2.2rem] p-6 sm:p-7 animate-fade-up-delay">
      <div className="border-b border-[var(--line)] pb-5">
        <p className="section-label text-xs">PDF receipt bonus</p>
        <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
          Shipment receipt workspace
        </h2>
        <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
          Generate a real PDF file from the protected backend using the live shipment record.
        </p>
      </div>

      {selectedShipment ? (
        <div className="mt-6 grid gap-4">
          <div className="rounded-[1.6rem] border border-[var(--line)] bg-white/76 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Selected shipment
                </p>
                <p className="mt-2 text-2xl font-semibold text-[color:var(--foreground)]">
                  {selectedShipment.reference}
                </p>
              </div>
              <span
                className={`inline-flex rounded-full border px-3 py-2 text-xs font-semibold ${statusPillClass(
                  selectedShipment.status
                )}`}
              >
                {toShipmentStatusLabel(selectedShipment.status)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Origin
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground)]">
                  {selectedShipment.origin}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Destination
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground)]">
                  {selectedShipment.destination}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Company
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground)]">
                  {selectedShipment.company}
                </p>
              </div>
              <div className="rounded-[1.2rem] border border-[var(--line)] bg-[rgba(255,255,255,0.7)] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                  Client
                </p>
                <p className="mt-2 text-sm text-[color:var(--foreground)]">
                  {selectedShipment.client}
                </p>
              </div>
            </div>
          </div>

          <AppButton onClick={onOpenReceipt}>Download shipment receipt PDF</AppButton>
        </div>
      ) : (
        <div className="mt-6 rounded-[1.6rem] border border-dashed border-[var(--line)] bg-white/62 px-5 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
          Select a shipment to prepare the receipt preview.
        </div>
      )}
    </section>
  );
}
