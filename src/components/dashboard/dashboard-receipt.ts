type DownloadReceiptParams = {
  reference: string;
  shipmentId: string;
  token: string;
};

export async function downloadShipmentReceipt({
  reference,
  shipmentId,
  token,
}: DownloadReceiptParams) {
  // The dashboard requests the PDF from the protected Route Handler so the file
  // is created from live backend data, not from a front-end-only preview.
  const response = await fetch(`/api/shipments/${shipmentId}/receipt`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({
      message: "Unable to generate the shipment PDF",
    }));

    throw new Error(data.message ?? "Unable to generate the shipment PDF");
  }

  const pdfBlob = await response.blob();
  const downloadUrl = URL.createObjectURL(pdfBlob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = `${reference.toLowerCase()}-receipt.pdf`;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
}
