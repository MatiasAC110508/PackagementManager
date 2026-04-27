'use client';

import ActivitySection from "@/components/dashboard/ActivitySection";
import DashboardHero from "@/components/dashboard/DashboardHero";
import DashboardLoadingState from "@/components/dashboard/DashboardLoadingState";
import NotificationsSection from "@/components/dashboard/NotificationsSection";
import ReceiptSection from "@/components/dashboard/ReceiptSection";
import ShipmentBoardSection from "@/components/dashboard/ShipmentBoardSection";
import ShipmentFormSection from "@/components/dashboard/ShipmentFormSection";
import TrackingSection from "@/components/dashboard/TrackingSection";
import { useShippingDashboard } from "@/components/dashboard/useShippingDashboard";

export default function ShippingDashboard() {
  const dashboard = useShippingDashboard();

  if (!dashboard.ready) {
    return <DashboardLoadingState />;
  }

  return (
    <section className="flex w-full flex-col gap-4">
      <DashboardHero
        feedback={dashboard.feedback}
        loadingBoard={dashboard.loadingBoard}
        onLogout={dashboard.handleLogout}
        sessionEmail={dashboard.sessionEmail}
        summary={dashboard.summary}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.28fr)_minmax(22rem,0.72fr)]">
        <div className="grid gap-4">
          <ShipmentFormSection
            editingId={dashboard.editingId}
            formState={dashboard.formState}
            onSubmit={dashboard.handleFormSubmit}
            resetForm={dashboard.resetForm}
            setFormState={dashboard.setFormState}
            submitting={dashboard.submitting}
          />

          <ShipmentBoardSection
            busyShipmentId={dashboard.busyShipmentId}
            filteredShipments={dashboard.filteredShipments}
            handleDelete={dashboard.handleDelete}
            handleEdit={dashboard.handleEdit}
            now={dashboard.now}
            searchTerm={dashboard.searchTerm}
            selectShipment={dashboard.selectShipment}
            setSearchTerm={dashboard.setSearchTerm}
            setStatusFilter={dashboard.setStatusFilter}
            shipments={dashboard.shipments}
            statusFilter={dashboard.statusFilter}
            updateShipmentStatus={dashboard.updateShipmentStatus}
          />
        </div>

        <div className="grid gap-4">
          <TrackingSection
            now={dashboard.now}
            shipments={dashboard.shipments}
          />

          <NotificationsSection
            notifications={dashboard.notifications}
            now={dashboard.now}
          />

          <ReceiptSection
            onOpenReceipt={dashboard.handleDownloadReceipt}
            selectedShipment={dashboard.selectedShipment}
          />

          <ActivitySection activity={dashboard.activity} />
        </div>
      </div>
    </section>
  );
}
