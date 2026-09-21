/**
 * useIncidents.ts
 * React hook for consuming and reporting incidents from the JalanAman Backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { incidentService, BackendIncident, CreateIncidentPayload } from '@/services';

export interface UseIncidentsReturn {
  incidents: BackendIncident[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  submitReport: (payload: CreateIncidentPayload) => Promise<BackendIncident>;
}

export function useIncidents(autoFetch = true): UseIncidentsReturn {
  const [incidents, setIncidents] = useState<BackendIncident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await incidentService.getIncidents();
      setIncidents(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat insiden');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitReport = useCallback(async (payload: CreateIncidentPayload): Promise<BackendIncident> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await incidentService.reportIncident(payload);
      setIncidents((prev) => [created, ...prev]);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengirimkan laporan insiden';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchIncidents();
    }
  }, [autoFetch, fetchIncidents]);

  return {
    incidents,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchIncidents,
    submitReport,
  };
}
