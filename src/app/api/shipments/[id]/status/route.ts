import { NextResponse } from "next/server";
import {
  getUserIdFromRequest,
  handleShipmentApiError,
} from "@/lib/shipment-api";
import { PrismaShipmentRepository } from "@/lib/repositories/PrismaShipmentRepository";
import { UpdateShipmentStatusUseCase } from "@/services/use-cases/UpdateShipmentStatus";

const shipmentRepository = new PrismaShipmentRepository();

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Status updates are separated from the full update endpoint because they
    // are the main trigger for tracking activity and client notifications.
    const userId = getUserIdFromRequest(request);
    const payload = await request.json();
    const { id } = await params;
    const updateShipmentStatus = new UpdateShipmentStatusUseCase(
      shipmentRepository
    );
    const shipment = await updateShipmentStatus.execute(id, userId, payload);

    return NextResponse.json({
      message: "Shipment status updated",
      shipment,
    });
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}
