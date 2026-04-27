import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";
import {
  buildNotificationMessage,
  createShipmentReference,
  normalizeShipmentInput,
} from "@/services/use-cases/shipmentUtils";

export class CreateShipmentUseCase {
  constructor(private readonly shipmentRepo: IShipmentRepository) {}

  async execute(ownerId: number, payload: unknown) {
    const shipmentInput = normalizeShipmentInput(payload);
    const shipment = await this.shipmentRepo.create(ownerId, {
      ...shipmentInput,
      reference: createShipmentReference(),
    });

    await this.shipmentRepo.createActivity({
      shipmentId: shipment.id,
      type: "CREATED",
      title: "Shipment created",
      detail: `${shipment.reference} was created for ${shipment.client}.`,
    });

    if (shipment.status === "DELIVERED") {
      await this.shipmentRepo.createNotification({
        shipmentId: shipment.id,
        client: shipment.client,
        status: shipment.status,
        message: buildNotificationMessage(shipment, shipment.status),
      });
    }

    return shipment;
  }
}
