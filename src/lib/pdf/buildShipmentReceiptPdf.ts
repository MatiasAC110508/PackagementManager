import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { Shipment } from "@/types/shipment";
import { toShipmentStatusLabel } from "@/types/shipment";

function drawField(
  page: Awaited<ReturnType<PDFDocument["addPage"]>>,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number
) {
  page.drawRectangle({
    x,
    y: y - 48,
    width,
    height: 58,
    borderColor: rgb(0.82, 0.78, 0.73),
    borderWidth: 1,
    color: rgb(0.98, 0.97, 0.95),
  });

  page.drawText(label.toUpperCase(), {
    x: x + 16,
    y: y - 18,
    size: 9,
    color: rgb(0.45, 0.42, 0.38),
  });

  page.drawText(value, {
    x: x + 16,
    y: y - 36,
    size: 13,
    color: rgb(0.1, 0.09, 0.08),
    maxWidth: width - 32,
  });
}

export async function buildShipmentReceiptPdf(shipment: Shipment) {
  // The PDF is generated on the server so the same receipt can be downloaded
  // consistently by any authenticated client without relying on browser print flows.
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]);

  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);

  const statusLabel = toShipmentStatusLabel(shipment.status);
  const deliveredLabel = shipment.delivered ? "Yes" : "No";
  const issuedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());
  const updatedAt = new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date(shipment.updatedAt));

  page.setFont(bodyFont);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: page.getWidth(),
    height: page.getHeight(),
    color: rgb(0.96, 0.94, 0.9),
  });

  page.drawText("IRONHAUL SHIPMENT RECEIPT", {
    x: 48,
    y: 784,
    size: 11,
    font: titleFont,
    color: rgb(0.6, 0.32, 0.12),
  });

  page.drawText(shipment.reference, {
    x: 48,
    y: 742,
    size: 28,
    font: titleFont,
    color: rgb(0.1, 0.09, 0.08),
  });

  page.drawText(
    "Heavy cargo receipt generated from the authenticated shipment dashboard.",
    {
      x: 48,
      y: 718,
      size: 11,
      font: bodyFont,
      color: rgb(0.38, 0.35, 0.31),
    }
  );

  drawField(page, "Origin", shipment.origin, 48, 654, 238);
  drawField(page, "Destination", shipment.destination, 310, 654, 238);
  drawField(page, "Company", shipment.company, 48, 580, 238);
  drawField(page, "Client", shipment.client, 310, 580, 238);
  drawField(page, "Status", statusLabel, 48, 506, 238);
  drawField(page, "Delivered", deliveredLabel, 310, 506, 238);

  page.drawText("Receipt details", {
    x: 48,
    y: 420,
    size: 16,
    font: titleFont,
    color: rgb(0.1, 0.09, 0.08),
  });

  page.drawText(`Issued: ${issuedAt}`, {
    x: 48,
    y: 390,
    size: 11,
    font: bodyFont,
    color: rgb(0.28, 0.26, 0.23),
  });

  page.drawText(`Last updated: ${updatedAt}`, {
    x: 48,
    y: 368,
    size: 11,
    font: bodyFont,
    color: rgb(0.28, 0.26, 0.23),
  });

  page.drawText(
    "This document was generated from the live shipment record stored by the Prisma ORM backend.",
    {
      x: 48,
      y: 330,
      size: 11,
      font: bodyFont,
      color: rgb(0.38, 0.35, 0.31),
      maxWidth: 500,
      lineHeight: 16,
    }
  );

  return pdf.save();
}
