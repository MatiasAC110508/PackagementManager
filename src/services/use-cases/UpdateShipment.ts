import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";
import {
  buildNotificationMessage,
  buildStatusChangeMessage,
  normalizeShipmentInput,
} from "@/services/use-cases/shipmentUtils";

export class UpdateShipmentUseCase {
  constructor(private readonly shipmentRepo: IShipmentRepository) {}

  async execute(id: string, ownerId: number, payload: unknown) {
    const currentShipment = await this.shipmentRepo.findByIdForOwner(id, ownerId);

    if (!currentShipment) {
      throw new Error("Shipment not found");
    }

    const shipmentInput = normalizeShipmentInput(payload);
    const updatedShipment = await this.shipmentRepo.update(
      id,
      ownerId,
      shipmentInput
    );

    await this.shipmentRepo.createActivity({
      shipmentId: updatedShipment.id,
      type: "UPDATED",
      title: "Shipment record updated",
      detail: `${updatedShipment.reference} was updated for ${updatedShipment.client}.`,
    });

    if (currentShipment.status !== updatedShipment.status) {
      await this.shipmentRepo.createActivity({
        shipmentId: updatedShipment.id,
        type: "STATUS_CHANGED",
        title: "Status updated",
        detail: buildStatusChangeMessage(
          updatedShipment,
          currentShipment.status,
          updatedShipment.status,
          "the operations form"
        ),
      });

      await this.shipmentRepo.createNotification({
        shipmentId: updatedShipment.id,
        client: updatedShipment.client,
        status: updatedShipment.status,
        message: buildNotificationMessage(
          updatedShipment,
          updatedShipment.status
        ),
      });
    }

    return updatedShipment;
  }
}
