export {
  shipmentStatuses,
  type ClientNotification,
  type ClientNotificationInput,
  type Shipment,
  type ShipmentActivity,
  type ShipmentActivityInput,
  type ShipmentDashboardData,
  type ShipmentInput,
  type ShipmentStatus,
  type ShipmentSummary,
} from "@/core/entities/Shipment";

import type { ShipmentStatus } from "@/core/entities/Shipment";

export const shipmentStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "IN_TRANSIT", label: "In transit" },
  { value: "DELIVERED", label: "Delivered" },
] as const satisfies ReadonlyArray<{
  value: ShipmentStatus;
  label: string;
}>;

export const shipmentStatusLabels: Record<ShipmentStatus, string> = {
  PENDING: "Pending",
  IN_TRANSIT: "In transit",
  DELIVERED: "Delivered",
};

export function toShipmentStatusLabel(status: ShipmentStatus) {
  return shipmentStatusLabels[status];
}
