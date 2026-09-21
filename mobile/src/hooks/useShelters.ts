/**
 * useShelters.ts
 * Clean React hook for fetching and managing Safe Haven locations from PostgreSQL backend.
 * Adheres to Dependency Inversion Principle (DIP).
 */

import { useState, useEffect, useCallback } from 'react';
import { shelterService, BackendShelter } from '@/services';
import { SafeHavenItem } from '@/types/emergencyCenter';

export interface UseSheltersReturn {
  shelters: SafeHavenItem[];
  rawShelters: BackendShelter[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useShelters(autoFetch = true): UseSheltersReturn {
  const [shelters, setShelters] = useState<SafeHavenItem[]>([]);
  const [rawShelters, setRawShelters] = useState<BackendShelter[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchShelters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [mappedData, rawData] = await Promise.all([
        shelterService.getShelters(),
        shelterService.getRawShelters(),
      ]);
      setShelters(mappedData);
      setRawShelters(rawData);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal memuat safe havens';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchShelters();
    }
  }, [autoFetch, fetchShelters]);

  return {
    shelters,
    rawShelters,
    isLoading,
    error,
    refetch: fetchShelters,
  };
}
