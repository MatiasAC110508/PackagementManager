import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";
import { buildShipmentSummary } from "@/services/use-cases/shipmentUtils";

export class GetShipmentDashboardUseCase {
  constructor(private readonly shipmentRepo: IShipmentRepository) {}

  async execute(ownerId: number) {
    const [shipments, activity, notifications] = await Promise.all([
      this.shipmentRepo.listByOwner(ownerId),
      this.shipmentRepo.listRecentActivity(ownerId),
      this.shipmentRepo.listRecentNotifications(ownerId),
    ]);

    return {
      shipments,
      activity,
      notifications,
      summary: buildShipmentSummary(shipments),
    };
  }
}
