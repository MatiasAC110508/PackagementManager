import {
  type ClientNotification,
  type ClientNotificationInput,
  type Shipment,
  type ShipmentActivity,
  type ShipmentActivityInput,
  type ShipmentInput,
  type ShipmentStatus,
} from "@/core/entities/Shipment";
import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";
import prisma from "@/lib/db";

type ShipmentRecord = Awaited<ReturnType<typeof prisma.shipment.findFirst>>;
type ShipmentEventRecord = Awaited<ReturnType<typeof prisma.shipmentEvent.findFirst>>;
type ClientNotificationRecord = Awaited<
  ReturnType<typeof prisma.clientNotification.findFirst>
>;

function mapShipment(record: NonNullable<ShipmentRecord>): Shipment {
  // Repository mappers convert Prisma records into plain dashboard-friendly
  // objects so the rest of the app never depends on Date instances directly.
  return {
    id: record.id,
    ownerId: record.ownerId,
    reference: record.reference,
    origin: record.origin,
    destination: record.destination,
    company: record.company,
    client: record.client,
    status: record.status as ShipmentStatus,
    delivered: record.delivered,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapActivity(record: NonNullable<ShipmentEventRecord>): ShipmentActivity {
  return {
    id: record.id,
    shipmentId: record.shipmentId,
    type: record.type,
    title: record.title,
    detail: record.detail,
    timestamp: record.createdAt.toISOString(),
  };
}

function mapNotification(
  record: NonNullable<ClientNotificationRecord>
): ClientNotification {
  return {
    id: record.id,
    shipmentId: record.shipmentId,
    client: record.client,
    status: record.status as ShipmentStatus,
    message: record.message,
    timestamp: record.createdAt.toISOString(),
  };
}

export class PrismaShipmentRepository implements IShipmentRepository {
  async listByOwner(ownerId: number) {
    const shipments = await prisma.shipment.findMany({
      where: { ownerId },
      orderBy: { updatedAt: "desc" },
    });

    return shipments.map(mapShipment);
  }

  async findByIdForOwner(id: string, ownerId: number) {
    const shipment = await prisma.shipment.findFirst({
      where: { id, ownerId },
    });

    return shipment ? mapShipment(shipment) : null;
  }

  async create(ownerId: number, shipment: ShipmentInput & { reference: string }) {
    const createdShipment = await prisma.shipment.create({
      data: {
        ownerId,
        reference: shipment.reference,
        origin: shipment.origin,
        destination: shipment.destination,
        company: shipment.company,
        client: shipment.client,
        status: shipment.status,
        delivered: shipment.delivered,
      },
    });

    return mapShipment(createdShipment);
  }

  async update(id: string, ownerId: number, shipment: ShipmentInput) {
    const existingShipment = await prisma.shipment.findFirst({
      where: { id, ownerId },
    });

    if (!existingShipment) {
      throw new Error("Shipment not found");
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        origin: shipment.origin,
        destination: shipment.destination,
        company: shipment.company,
        client: shipment.client,
        status: shipment.status,
        delivered: shipment.delivered,
      },
    });

    return mapShipment(updatedShipment);
  }

  async updateStatus(
    id: string,
    ownerId: number,
    status: ShipmentStatus,
    delivered: boolean
  ) {
    const existingShipment = await prisma.shipment.findFirst({
      where: { id, ownerId },
    });

    if (!existingShipment) {
      throw new Error("Shipment not found");
    }

    const updatedShipment = await prisma.shipment.update({
      where: { id },
      data: {
        status,
        delivered,
      },
    });

    return mapShipment(updatedShipment);
  }

  async delete(id: string, ownerId: number) {
    const existingShipment = await prisma.shipment.findFirst({
      where: { id, ownerId },
    });

    if (!existingShipment) {
      throw new Error("Shipment not found");
    }

    const deletedShipment = await prisma.shipment.delete({
      where: { id },
    });

    return mapShipment(deletedShipment);
  }

  async createActivity(activity: ShipmentActivityInput) {
    // Activity entries power the "operations feed" panel in the dashboard.
    const createdActivity = await prisma.shipmentEvent.create({
      data: {
        shipmentId: activity.shipmentId,
        type: activity.type,
        title: activity.title,
        detail: activity.detail,
      },
    });

    return mapActivity(createdActivity);
  }

  async listRecentActivity(ownerId: number, limit = 14) {
    const activity = await prisma.shipmentEvent.findMany({
      where: {
        shipment: {
          ownerId,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return activity.map(mapActivity);
  }

  async createNotification(notification: ClientNotificationInput) {
    // Notifications are stored explicitly so status changes survive refreshes
    // and remain visible in the dashboard history.
    const createdNotification = await prisma.clientNotification.create({
      data: {
        shipmentId: notification.shipmentId,
        client: notification.client,
        status: notification.status,
        message: notification.message,
      },
    });

    return mapNotification(createdNotification);
  }

  async listRecentNotifications(ownerId: number, limit = 12) {
    const notifications = await prisma.clientNotification.findMany({
      where: {
        shipment: {
          ownerId,
        },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return notifications.map(mapNotification);
  }
}
