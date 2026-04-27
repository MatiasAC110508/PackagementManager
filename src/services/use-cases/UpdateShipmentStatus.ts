import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";
import {
  buildNotificationMessage,
  buildStatusChangeMessage,
  ensureShipmentStatus,
} from "@/services/use-cases/shipmentUtils";

export class UpdateShipmentStatusUseCase {
  constructor(private readonly shipmentRepo: IShipmentRepository) {}

  async execute(id: string, ownerId: number, payload: unknown) {
    const currentShipment = await this.shipmentRepo.findByIdForOwner(id, ownerId);

    if (!currentShipment) {
      throw new Error("Shipment not found");
    }

    const status =
      typeof payload === "object" && payload !== null
        ? ensureShipmentStatus((payload as { status?: unknown }).status)
        : ensureShipmentStatus(undefined);

    if (currentShipment.status === status) {
      return currentShipment;
    }

    const updatedShipment = await this.shipmentRepo.updateStatus(
      id,
      ownerId,
      status,
      status === "DELIVERED"
    );

    await this.shipmentRepo.createActivity({
      shipmentId: updatedShipment.id,
      type: "STATUS_CHANGED",
      title: "Status updated",
      detail: buildStatusChangeMessage(
        updatedShipment,
        currentShipment.status,
        updatedShipment.status,
        "the live tracking board"
      ),
    });

    await this.shipmentRepo.createNotification({
      shipmentId: updatedShipment.id,
      client: updatedShipment.client,
      status: updatedShipment.status,
      message: buildNotificationMessage(updatedShipment, updatedShipment.status),
    });

    return updatedShipment;
  }
}
