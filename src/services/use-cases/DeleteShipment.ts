import { IShipmentRepository } from "@/core/repositories/IShipmentRepository";

export class DeleteShipmentUseCase {
  constructor(private readonly shipmentRepo: IShipmentRepository) {}

  async execute(id: string, ownerId: number) {
    return this.shipmentRepo.delete(id, ownerId);
  }
}
