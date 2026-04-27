import {
  ClientNotification,
  ClientNotificationInput,
  Shipment,
  ShipmentActivity,
  ShipmentActivityInput,
  ShipmentInput,
  ShipmentStatus,
} from "@/core/entities/Shipment";

export interface IShipmentRepository {
  listByOwner(ownerId: number): Promise<Shipment[]>;
  findByIdForOwner(id: string, ownerId: number): Promise<Shipment | null>;
  create(
    ownerId: number,
    shipment: ShipmentInput & { reference: string }
  ): Promise<Shipment>;
  update(id: string, ownerId: number, shipment: ShipmentInput): Promise<Shipment>;
  updateStatus(
    id: string,
    ownerId: number,
    status: ShipmentStatus,
    delivered: boolean
  ): Promise<Shipment>;
  delete(id: string, ownerId: number): Promise<Shipment>;
  createActivity(activity: ShipmentActivityInput): Promise<ShipmentActivity>;
  listRecentActivity(ownerId: number, limit?: number): Promise<ShipmentActivity[]>;
  createNotification(
    notification: ClientNotificationInput
  ): Promise<ClientNotification>;
  listRecentNotifications(
    ownerId: number,
    limit?: number
  ): Promise<ClientNotification[]>;
}
