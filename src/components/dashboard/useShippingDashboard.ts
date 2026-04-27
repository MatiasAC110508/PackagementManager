'use client';

import {
  type FormEvent,
  startTransition,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { downloadShipmentReceipt } from "@/components/dashboard/dashboard-receipt";
import type {
  ClientNotification,
  Shipment,
  ShipmentActivity,
  ShipmentDashboardData,
  ShipmentSummary,
  ShipmentStatus,
} from "@/types/shipment";
import { toShipmentStatusLabel } from "@/types/shipment";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  emptyFormState,
  emptySummary,
  REFRESH_INTERVAL_MS,
  SESSION_STORAGE_KEY,
} from "@/components/dashboard/dashboard.constants";
import type {
  FeedbackState,
  ShipmentFormState,
  StatusFilter,
} from "@/components/dashboard/dashboard.types";
import { readJson } from "@/components/dashboard/dashboard.utils";

export function useShippingDashboard() {
  const router = useRouter();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [activity, setActivity] = useState<ShipmentActivity[]>([]);
  const [notifications, setNotifications] = useState<ClientNotification[]>([]);
  const [summary, setSummary] = useState<ShipmentSummary>(emptySummary);
  const [sessionEmail, setSessionEmail] = useState("");
  const [ready, setReady] = useState(false);
  const [loadingBoard, setLoadingBoard] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyShipmentId, setBusyShipmentId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [formState, setFormState] = useState<ShipmentFormState>(emptyFormState);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [now, setNow] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>(null);

  const deferredSearch = useDeferredValue(searchTerm.trim().toLowerCase());

  const clearLocalSession = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }, []);

  const buildHeaders = useCallback((includeJson = false) => {
    if (typeof window === "undefined") {
      return null;
    }

    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!token) {
      return null;
    }

    return {
      ...(includeJson ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const redirectToLogin = useCallback(
    (message: string) => {
      // Clearing the local session before redirecting keeps the auth flow predictable
      // when the access token expires or a protected request fails.
      clearLocalSession();
      setFeedback({
        text: message,
        variant: "error",
      });

      startTransition(() => {
        router.replace("/login");
      });
    },
    [clearLocalSession, router]
  );

  const loadDashboard = useCallback(
    async ({
      preferredSelectedId = null,
      silent = false,
    }: {
      preferredSelectedId?: string | null;
      silent?: boolean;
    } = {}) => {
      // Every dashboard panel depends on the same payload, so one request keeps
      // the client state consistent across shipments, activity, notifications,
      // and KPI summary cards.
      const headers = buildHeaders();

      if (!headers) {
        redirectToLogin("Your session is not available anymore. Please sign in again.");
        return;
      }

      if (!silent) {
        setLoadingBoard(true);
      }

      try {
        const response = await fetch("/api/shipments", {
          headers,
          cache: "no-store",
        });

        const data = (await readJson(response)) as ShipmentDashboardData & {
          message?: string;
        };

        if (response.status === 401) {
          redirectToLogin(data.message ?? "Session expired. Please sign in again.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to load shipments");
        }

        setShipments(data.shipments);
        setActivity(data.activity);
        setNotifications(data.notifications);
        setSummary(data.summary);
        setSelectedShipmentId((current) => {
          const nextSelectedId = preferredSelectedId ?? current;

          if (
            nextSelectedId &&
            data.shipments.some((shipment) => shipment.id === nextSelectedId)
          ) {
            return nextSelectedId;
          }

          return data.shipments[0]?.id ?? null;
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unable to load the dashboard";

        setFeedback({
          text: message,
          variant: "error",
        });
      } finally {
        setReady(true);
        setLoadingBoard(false);
      }
    },
    [buildHeaders, redirectToLogin]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const sessionRaw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    const accessToken = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!sessionRaw || !accessToken) {
      startTransition(() => {
        router.replace("/login");
      });
      return;
    }

    try {
      // The login flow stores a lightweight user snapshot locally so the dashboard
      // can show the signed-in email immediately before API data finishes loading.
      const session = JSON.parse(sessionRaw) as { email?: string };
      setSessionEmail(session.email ?? "ops@ironhaul.com");
    } catch {
      setSessionEmail("ops@ironhaul.com");
    }

    void loadDashboard({ silent: false });
  }, [loadDashboard, router]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const primeClock = window.setTimeout(() => {
      setNow(Date.now());
    }, 0);

    const timer = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      window.clearTimeout(primeClock);
      window.clearInterval(timer);
    };
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const refreshTimer = window.setInterval(() => {
      if (document.visibilityState !== "visible") {
        return;
      }

      void loadDashboard({
        preferredSelectedId: selectedShipmentId,
        silent: true,
      });
    }, REFRESH_INTERVAL_MS);

    return () => {
      window.clearInterval(refreshTimer);
    };
  }, [loadDashboard, ready, selectedShipmentId]);

  const filteredShipments = shipments.filter((shipment) => {
    const haystack = [
      shipment.reference,
      shipment.origin,
      shipment.destination,
      shipment.company,
      shipment.client,
      toShipmentStatusLabel(shipment.status),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      deferredSearch.length === 0 || haystack.includes(deferredSearch);
    const matchesStatus =
      statusFilter === "ALL" || shipment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const selectedShipment =
    shipments.find((shipment) => shipment.id === selectedShipmentId) ??
    filteredShipments[0] ??
    shipments[0] ??
    null;

  const resetForm = useCallback(() => {
    setFormState(emptyFormState);
    setEditingId(null);
  }, []);

  const selectShipment = useCallback((shipmentId: string) => {
    setSelectedShipmentId(shipmentId);
  }, []);

  const handleEdit = useCallback((shipment: Shipment) => {
    setEditingId(shipment.id);
    setSelectedShipmentId(shipment.id);
    setFormState({
      origin: shipment.origin,
      destination: shipment.destination,
      company: shipment.company,
      client: shipment.client,
      status: shipment.status,
      delivered: shipment.delivered,
    });
  }, []);

  const handleFormSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setSubmitting(true);
      setFeedback(null);

      const headers = buildHeaders(true);

      if (!headers) {
        setSubmitting(false);
        redirectToLogin("Your session expired. Please sign in again.");
        return;
      }

      try {
        // Normalizing form values here keeps the API payload clean and ensures
        // the delivered flag always matches the selected shipment status.
        const normalizedPayload: ShipmentFormState = {
          origin: formState.origin.trim(),
          destination: formState.destination.trim(),
          company: formState.company.trim(),
          client: formState.client.trim(),
          status: formState.delivered ? "DELIVERED" : formState.status,
          delivered: formState.delivered || formState.status === "DELIVERED",
        };

        const response = await fetch(
          editingId ? `/api/shipments/${editingId}` : "/api/shipments",
          {
            method: editingId ? "PUT" : "POST",
            headers,
            body: JSON.stringify(normalizedPayload),
          }
        );

        const data = (await readJson(response)) as {
          message?: string;
          shipment?: Shipment;
        };

        if (response.status === 401) {
          redirectToLogin(data.message ?? "Session expired. Please sign in again.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to save the shipment");
        }

        setFeedback({
          text:
            data.message ?? (editingId ? "Shipment updated" : "Shipment created"),
          variant: "success",
        });

        resetForm();
        await loadDashboard({
          preferredSelectedId: data.shipment?.id ?? selectedShipmentId,
          silent: true,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unable to save the shipment";

        setFeedback({
          text: message,
          variant: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
    [
      buildHeaders,
      editingId,
      formState,
      loadDashboard,
      redirectToLogin,
      resetForm,
      selectedShipmentId,
    ]
  );

  const updateShipmentStatus = useCallback(
    async (shipmentId: string, nextStatus: ShipmentStatus) => {
      setBusyShipmentId(shipmentId);
      setFeedback(null);

      const headers = buildHeaders(true);

      if (!headers) {
        setBusyShipmentId(null);
        redirectToLogin("Your session expired. Please sign in again.");
        return;
      }

      try {
        // Status changes go through a dedicated endpoint because they also create
        // tracking activity and client notifications on the backend.
        const response = await fetch(`/api/shipments/${shipmentId}/status`, {
          method: "PATCH",
          headers,
          body: JSON.stringify({ status: nextStatus }),
        });

        const data = (await readJson(response)) as {
          message?: string;
          shipment?: Shipment;
        };

        if (response.status === 401) {
          redirectToLogin(data.message ?? "Session expired. Please sign in again.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to update the shipment status");
        }

        if (editingId === shipmentId && data.shipment) {
          setFormState((current) => ({
            ...current,
            status: data.shipment?.status ?? current.status,
            delivered: data.shipment?.delivered ?? current.delivered,
          }));
        }

        setFeedback({
          text: data.message ?? "Shipment status updated",
          variant: "success",
        });

        await loadDashboard({
          preferredSelectedId: data.shipment?.id ?? shipmentId,
          silent: true,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error
            ? error.message
            : "Unable to update the shipment status";

        setFeedback({
          text: message,
          variant: "error",
        });
      } finally {
        setBusyShipmentId(null);
      }
    },
    [buildHeaders, editingId, loadDashboard, redirectToLogin]
  );

  const handleDelete = useCallback(
    async (shipment: Shipment) => {
      const confirmed = window.confirm(
        `Delete ${shipment.reference} for ${shipment.client}?`
      );

      if (!confirmed) {
        return;
      }

      setBusyShipmentId(shipment.id);
      setFeedback(null);

      const headers = buildHeaders();

      if (!headers) {
        setBusyShipmentId(null);
        redirectToLogin("Your session expired. Please sign in again.");
        return;
      }

      try {
        const response = await fetch(`/api/shipments/${shipment.id}`, {
          method: "DELETE",
          headers,
        });

        const data = (await readJson(response)) as {
          message?: string;
        };

        if (response.status === 401) {
          redirectToLogin(data.message ?? "Session expired. Please sign in again.");
          return;
        }

        if (!response.ok) {
          throw new Error(data.message ?? "Unable to delete the shipment");
        }

        if (editingId === shipment.id) {
          resetForm();
        }

        setFeedback({
          text: data.message ?? "Shipment deleted",
          variant: "success",
        });

        await loadDashboard({
          preferredSelectedId:
            selectedShipmentId === shipment.id ? null : selectedShipmentId,
          silent: true,
        });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : "Unable to delete the shipment";

        setFeedback({
          text: message,
          variant: "error",
        });
      } finally {
        setBusyShipmentId(null);
      }
    },
    [
      buildHeaders,
      editingId,
      loadDashboard,
      redirectToLogin,
      resetForm,
      selectedShipmentId,
    ]
  );

  const handleLogout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Local session is still cleared even if the API request fails.
    }

    clearLocalSession();

    startTransition(() => {
      router.push("/login");
    });
  }, [clearLocalSession, router]);

  const handleDownloadReceipt = useCallback(async () => {
    if (!selectedShipment || typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

    if (!token) {
      redirectToLogin("Your session expired. Please sign in again.");
      return;
    }

    setFeedback(null);

    try {
      await downloadShipmentReceipt({
        shipmentId: selectedShipment.id,
        reference: selectedShipment.reference,
        token,
      });

      setFeedback({
        text: "Shipment receipt PDF created successfully.",
        variant: "success",
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unable to create the shipment PDF";

      if (message === "Unauthorized" || message === "Session expired") {
        redirectToLogin("Your session expired. Please sign in again.");
        return;
      }

      setFeedback({
        text: message,
        variant: "error",
      });
    }
  }, [redirectToLogin, selectedShipment]);

  return {
    activity,
    busyShipmentId,
    editingId,
    feedback,
    filteredShipments,
    formState,
    handleDelete,
    handleDownloadReceipt,
    handleEdit,
    handleFormSubmit,
    handleLogout,
    loadingBoard,
    notifications,
    now,
    ready,
    resetForm,
    searchTerm,
    selectShipment,
    selectedShipment,
    sessionEmail,
    setFormState,
    setSearchTerm,
    setStatusFilter,
    shipments,
    statusFilter,
    submitting,
    summary,
    updateShipmentStatus,
  };
}
