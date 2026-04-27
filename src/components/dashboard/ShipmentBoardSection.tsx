import AppButton from "@/components/ui/AppButton";
import {
  statusFilters,
} from "@/components/dashboard/dashboard.constants";
import type { StatusFilter } from "@/components/dashboard/dashboard.types";
import {
  formatRelativeTime,
  progressWidth,
  statusPillClass,
} from "@/components/dashboard/dashboard.utils";
import {
  shipmentStatusOptions,
  toShipmentStatusLabel,
  type Shipment,
  type ShipmentStatus,
} from "@/types/shipment";

type ShipmentBoardSectionProps = {
  busyShipmentId: string | null;
  filteredShipments: Shipment[];
  handleDelete: (shipment: Shipment) => void | Promise<void>;
  handleEdit: (shipment: Shipment) => void;
  now: number;
  searchTerm: string;
  selectShipment: (shipmentId: string) => void;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: StatusFilter) => void;
  shipments: Shipment[];
  statusFilter: StatusFilter;
  updateShipmentStatus: (
    shipmentId: string,
    nextStatus: ShipmentStatus
  ) => void | Promise<void>;
};

export default function ShipmentBoardSection({
  busyShipmentId,
  filteredShipments,
  handleDelete,
  handleEdit,
  now,
  searchTerm,
  selectShipment,
  setSearchTerm,
  setStatusFilter,
  shipments,
  statusFilter,
  updateShipmentStatus,
}: ShipmentBoardSectionProps) {
  return (
    <section className="surface-panel rounded-[2.2rem] p-6 sm:p-7 animate-fade-up-delay">
      <div className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label text-xs">Shipment board</p>
          <h2 className="mt-3 text-2xl font-semibold text-[color:var(--foreground)]">
            Live control of every load
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem] lg:min-w-[28rem]">
          <input
            className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by client, company, route, or reference"
          />
          <select
            className="rounded-[1.2rem] border border-[var(--line)] bg-white/78 px-4 py-3 text-sm outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(212,114,48,0.12)]"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            {statusFilters.map((filter) => (
              <option key={filter.value} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-3">
        {filteredShipments.length === 0 ? (
          <div className="rounded-[1.6rem] border border-dashed border-[var(--line)] bg-white/62 px-5 py-8 text-center text-sm leading-6 text-[color:var(--muted)]">
            {shipments.length === 0
              ? "No shipments yet. Create the first shipment to open the live board."
              : "No shipments match the current search or filter."}
          </div>
        ) : (
          filteredShipments.map((shipment) => {
            const isBusy = busyShipmentId === shipment.id;

            return (
              <article
                key={shipment.id}
                className="rounded-[1.6rem] border border-[var(--line)] bg-white/72 p-5"
              >
                <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,0.7fr)_minmax(0,0.7fr)_minmax(0,0.65fr)_minmax(0,0.65fr)_13rem_8rem_auto] xl:items-center">
                  <button
                    type="button"
                    onClick={() => selectShipment(shipment.id)}
                    className="text-left"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Origin
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                      {shipment.origin}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      {shipment.reference}
                    </p>
                  </button>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Destination
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)]">
                      {shipment.destination}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      Updated {formatRelativeTime(shipment.updatedAt, now)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Company
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">
                      {shipment.company}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      Client
                    </p>
                    <p className="mt-2 text-sm text-[color:var(--foreground)]">
                      {shipment.client}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <select
                        className="w-full rounded-[1rem] border border-[var(--line)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)]"
                        value={shipment.status}
                        disabled={isBusy}
                        onChange={(event) =>
                          void updateShipmentStatus(
                            shipment.id,
                            event.target.value as ShipmentStatus
                          )
                        }
                      >
                        {shipmentStatusOptions.map((status) => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full border px-3 py-2 text-xs font-semibold ${statusPillClass(
                          shipment.status
                        )}`}
                      >
                        {toShipmentStatusLabel(shipment.status)}
                      </span>
                    </div>

                    <div className="h-2 rounded-full bg-[rgba(24,22,19,0.08)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: progressWidth(shipment.status) }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 xl:items-end">
                    <label className="flex items-center gap-2 text-sm text-[color:var(--foreground)]">
                      <input
                        type="checkbox"
                        checked={shipment.delivered}
                        disabled={isBusy}
                        onChange={(event) =>
                          void updateShipmentStatus(
                            shipment.id,
                            event.target.checked
                              ? "DELIVERED"
                              : shipment.status === "DELIVERED"
                                ? "IN_TRANSIT"
                                : shipment.status
                          )
                        }
                      />
                      Delivered
                    </label>
                    <div className="flex flex-wrap gap-2 xl:justify-end">
                      <AppButton
                        className="px-3 py-2 text-xs"
                        variant="ghost"
                        onClick={() => selectShipment(shipment.id)}
                      >
                        Select
                      </AppButton>
                      <AppButton
                        className="px-3 py-2 text-xs"
                        variant="secondary"
                        disabled={isBusy}
                        onClick={() => handleEdit(shipment)}
                      >
                        Edit
                      </AppButton>
                      <AppButton
                        className="px-3 py-2 text-xs"
                        variant="ghost"
                        disabled={isBusy}
                        onClick={() => void handleDelete(shipment)}
                      >
                        Delete
                      </AppButton>
                    </div>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
