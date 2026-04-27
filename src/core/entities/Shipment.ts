export const shipmentStatuses = ["PENDING", "IN_TRANSIT", "DELIVERED"] as const;

export type ShipmentStatus = (typeof shipmentStatuses)[number];

export type ShipmentEventType = "CREATED" | "UPDATED" | "STATUS_CHANGED";

export type ShipmentInput = {
  origin: string;
  destination: string;
  company: string;
  client: string;
  status: ShipmentStatus;
  delivered: boolean;
};

export interface Shipment extends ShipmentInput {
  id: string;
  ownerId: number;
  reference: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentActivity {
  id: string;
  shipmentId: string;
  type: ShipmentEventType;
  title: string;
  detail: string;
  timestamp: string;
}

export type ShipmentActivityInput = Omit<ShipmentActivity, "id" | "timestamp">;

export interface ClientNotification {
  id: string;
  shipmentId: string;
  client: string;
  status: ShipmentStatus;
  message: string;
  timestamp: string;
}

export type ClientNotificationInput = Omit<
  ClientNotification,
  "id" | "timestamp"
>;

export interface ShipmentSummary {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
}

export interface ShipmentDashboardData {
  shipments: Shipment[];
  activity: ShipmentActivity[];
  notifications: ClientNotification[];
  summary: ShipmentSummary;
}
