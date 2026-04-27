import { NextResponse } from "next/server";
import { PrismaShipmentRepository } from "@/lib/repositories/PrismaShipmentRepository";
import {
  getUserIdFromRequest,
  handleShipmentApiError,
} from "@/lib/shipment-api";
import { CreateShipmentUseCase } from "@/services/use-cases/CreateShipment";
import { GetShipmentDashboardUseCase } from "@/services/use-cases/GetShipmentDashboard";

const shipmentRepository = new PrismaShipmentRepository();

export async function GET(request: Request) {
  try {
    // The dashboard bootstraps from one payload so the client receives
    // shipments, activity, notifications, and summary in a single request.
    const userId = getUserIdFromRequest(request);
    const getShipmentDashboard = new GetShipmentDashboardUseCase(
      shipmentRepository
    );
    const dashboard = await getShipmentDashboard.execute(userId);

    return NextResponse.json(dashboard);
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    // Shipment creation is delegated to a use case so validation, reference
    // generation, and side effects stay out of the Route Handler.
    const userId = getUserIdFromRequest(request);
    const payload = await request.json();
    const createShipment = new CreateShipmentUseCase(shipmentRepository);
    const shipment = await createShipment.execute(userId, payload);

    return NextResponse.json(
      {
        message: "Shipment created",
        shipment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}
