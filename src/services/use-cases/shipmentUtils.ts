import {
  shipmentStatuses,
  type Shipment,
  type ShipmentInput,
  type ShipmentStatus,
  type ShipmentSummary,
} from "@/core/entities/Shipment";

const shipmentStatusSet = new Set<ShipmentStatus>(shipmentStatuses);

function requireText(value: unknown, fieldName: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

function toSentenceStatus(status: ShipmentStatus) {
  return status.replaceAll("_", " ").toLowerCase();
}

export function ensureShipmentStatus(value: unknown): ShipmentStatus {
  if (typeof value !== "string") {
    throw new Error("Shipment status is required");
  }

  const normalizedStatus = value.trim().toUpperCase() as ShipmentStatus;

  if (!shipmentStatusSet.has(normalizedStatus)) {
    throw new Error("Invalid shipment status");
  }

  return normalizedStatus;
}

export function normalizeShipmentInput(payload: unknown): ShipmentInput {
  if (typeof payload !== "object" || payload === null) {
    throw new Error("Invalid shipment payload");
  }

  const data = payload as Record<string, unknown>;
  const requestedStatus = ensureShipmentStatus(data.status ?? "PENDING");
  const requestedDelivered = Boolean(data.delivered);
  const finalStatus =
    requestedDelivered || requestedStatus === "DELIVERED"
      ? "DELIVERED"
      : requestedStatus;

  return {
    origin: requireText(data.origin, "Origin"),
    destination: requireText(data.destination, "Destination"),
    company: requireText(data.company, "Company"),
    client: requireText(data.client, "Client"),
    status: finalStatus,
    delivered: finalStatus === "DELIVERED",
  };
}

export function createShipmentReference() {
  const timePart = Date.now().toString(36).slice(-6).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 5).toUpperCase();

  return `IH-${timePart}${randomPart}`;
}

export function buildShipmentSummary(shipments: Shipment[]): ShipmentSummary {
  return {
    total: shipments.length,
    pending: shipments.filter((shipment) => shipment.status === "PENDING").length,
    inTransit: shipments.filter(
      (shipment) => shipment.status === "IN_TRANSIT"
    ).length,
    delivered: shipments.filter((shipment) => shipment.status === "DELIVERED")
      .length,
  };
}

export function buildStatusChangeMessage(
  shipment: Shipment,
  previousStatus: ShipmentStatus,
  nextStatus: ShipmentStatus,
  source: string
) {
  return `${shipment.reference} moved from ${toSentenceStatus(
    previousStatus
  )} to ${toSentenceStatus(nextStatus)} through ${source}.`;
}

export function buildNotificationMessage(
  shipment: Shipment,
  nextStatus: ShipmentStatus
) {
  if (nextStatus === "DELIVERED") {
    return `Client update ready: ${shipment.reference} was delivered successfully.`;
  }

  return `Client update ready: ${shipment.reference} is now ${toSentenceStatus(
    nextStatus
  )}.`;
}
