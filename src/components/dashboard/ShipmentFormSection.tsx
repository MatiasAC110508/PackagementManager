import type { Dispatch, FormEvent, SetStateAction } from "react";
import AppButton from "@/components/ui/AppButton";
import { shipmentStatusOptions, type ShipmentStatus } from "@/types/shipment";
import type { ShipmentFormState } from "@/components/dashboard/dashboard.types";

type ShipmentFormSectionProps = {
  editingId: string | null;
  formState: ShipmentFormState;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
  resetForm: () => void;
  setFormState: Dispatch<SetStateAction<ShipmentFormState>>;
  submitting: boolean;
};

export default function ShipmentFormSection({
  editingId,
  formState,
  onSubmit,
  resetForm,
  setFormState,
  submitting,
}: ShipmentFormSectionProps) {
  return (
    <section className="surface-panel rounded-[2.2rem] p-6 sm:p-7 animate-fade-up">
      <div className="flex flex-col gap-3 border-b border-[var(--line)] pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-label text-xs">Shipment CRUD</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Create or update a shipment
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[color:var(--muted)]">
          Every change is saved to the live API, reflected in the tracking
          feed, and ready to notify the client when status moves.
        </p>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-[color:var(--foreground)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Origin
            </span>
            <input
              className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
              value={formState.origin}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  origin: event.target.value,
                }))
              }
              placeholder="Houston Port"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-[color:var(--foreground)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Destination
            </span>
            <input
              className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
              value={formState.destination}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  destination: event.target.value,
                }))
              }
              placeholder="Monterrey Plant"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-[color:var(--foreground)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Company
            </span>
            <input
              className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
              value={formState.company}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  company: event.target.value,
                }))
              }
              placeholder="Atlas Heavy Logistics"
              required
            />
          </label>

          <label className="grid gap-2 text-sm text-[color:var(--foreground)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Client
            </span>
            <input
              className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
              value={formState.client}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  client: event.target.value,
                }))
              }
              placeholder="NorthGrid Energy"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,0.7fr)_minmax(0,0.3fr)_auto] md:items-end">
          <label className="grid gap-2 text-sm text-[color:var(--foreground)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
              Status
            </span>
            <select
              className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
              value={formState.status}
              onChange={(event) => {
                const nextStatus = event.target.value as ShipmentStatus;
                setFormState((current) => ({
                  ...current,
                  status: nextStatus,
                  delivered: nextStatus === "DELIVERED",
                }));
              }}
            >
              {shipmentStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-3 rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm text-[color:var(--foreground)]">
            <input
              type="checkbox"
              checked={formState.delivered}
              onChange={(event) => {
                const checked = event.target.checked;
                setFormState((current) => ({
                  ...current,
                  delivered: checked,
                  status: checked
                    ? "DELIVERED"
                    : current.status === "DELIVERED"
                      ? "IN_TRANSIT"
                      : current.status,
                }));
              }}
            />
            Delivered
          </label>

          <div className="flex gap-3">
            <AppButton disabled={submitting} type="submit">
              {submitting
                ? editingId
                  ? "Saving shipment..."
                  : "Creating shipment..."
                : editingId
                  ? "Update shipment"
                  : "Create shipment"}
            </AppButton>
            {editingId ? (
              <AppButton
                type="button"
                variant="secondary"
                onClick={resetForm}
              >
                Cancel edit
              </AppButton>
            ) : null}
          </div>
        </div>
      </form>
    </section>
  );
}
