import type { ShipmentSummary } from "@/types/shipment";
import { shipmentStatusOptions } from "@/types/shipment";
import type {
  ShipmentFormState,
  StatusFilter,
} from "@/components/dashboard/dashboard.types";

export const SESSION_STORAGE_KEY = "signed-in-user";
export const ACCESS_TOKEN_STORAGE_KEY = "auth-access-token";
export const REFRESH_INTERVAL_MS = 10_000;

export const statusFilters: Array<{ value: StatusFilter; label: string }> = [
  { value: "ALL", label: "All statuses" },
  ...shipmentStatusOptions,
];

export const emptyFormState: ShipmentFormState = {
  origin: "",
  destination: "",
  company: "",
  client: "",
  status: "PENDING",
  delivered: false,
};

export const emptySummary: ShipmentSummary = {
  total: 0,
  pending: 0,
  inTransit: 0,
  delivered: 0,
};
