import type { ShipmentInput, ShipmentStatus } from "@/types/shipment";

export type StatusFilter = ShipmentStatus | "ALL";

export type FeedbackState = {
  text: string;
  variant: "error" | "success" | "info";
} | null;

export type ShipmentFormState = ShipmentInput;
