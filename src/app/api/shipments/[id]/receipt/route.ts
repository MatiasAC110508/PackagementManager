import {
  getUserIdFromRequest,
  handleShipmentApiError,
} from "@/lib/shipment-api";
import { buildShipmentReceiptPdf } from "@/lib/pdf/buildShipmentReceiptPdf";
import { PrismaShipmentRepository } from "@/lib/repositories/PrismaShipmentRepository";

const shipmentRepository = new PrismaShipmentRepository();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // The receipt is protected with the same token-based flow as the rest of the
    // shipment API so users can only download their own shipment documents.
    const userId = getUserIdFromRequest(request);
    const { id } = await params;
    const shipment = await shipmentRepository.findByIdForOwner(id, userId);

    if (!shipment) {
      throw new Error("Shipment not found");
    }

    const pdfBytes = await buildShipmentReceiptPdf(shipment);
    
    // Envolver en un Blob
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    
    return new Response(pdfBlob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error: unknown) {
    return handleShipmentApiError(error);
  }
}
