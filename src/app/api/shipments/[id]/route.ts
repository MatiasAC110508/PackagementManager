import { NextResponse } from "next/server";
import { PrismaShipmentRepository } from "@/lib/repositories/PrismaShipmentRepository";
import {
  getUserIdFromRequest,
  handleShipmentApiError,
} from "@/lib/shipment-api";
import { DeleteShipmentUseCase } from "@/services/use-cases/DeleteShipment";
import { UpdateShipmentUseCase } from "@/services/use-cases/UpdateShipment";

const shipmentRepository = new PrismaShipmentRepository();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // This endpoint powers receipt generation and detail lookups for one shipment.
    const userId = getUserIdFromRequest(request);
    const { id } = await params;
    const shipment = await shipmentRepository.findByIdForOwner(id, userId);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    return NextResponse.json({ shipment });
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Full record updates use the dedicated use case because they may also
    // create status activity and client notifications when the status changes.
    const userId = getUserIdFromRequest(request);
    const payload = await request.json();
    const { id } = await params;
    const updateShipment = new UpdateShipmentUseCase(shipmentRepository);
    const shipment = await updateShipment.execute(id, userId, payload);

    return NextResponse.json({
      message: "Shipment updated",
      shipment,
    });
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Deleting a shipment removes the record only for its authenticated owner.
    const userId = getUserIdFromRequest(request);
    const { id } = await params;
    const deleteShipment = new DeleteShipmentUseCase(shipmentRepository);
    const shipment = await deleteShipment.execute(id, userId);

    return NextResponse.json({
      message: "Shipment deleted",
      shipment,
    });
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}
