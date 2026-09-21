/**
 * useBackendStatus.ts
 * Real-time connection hook to monitor JalanAman Go Backend Gateway health.
 */

import { useState, useEffect, useCallback } from 'react';
import { healthService, HealthCheckData } from '@/services';

export interface UseBackendStatusReturn {
  isConnected: boolean;
  isChecking: boolean;
  healthData: HealthCheckData | null;
  error: string | null;
  checkStatus: () => Promise<void>;
}

export function useBackendStatus(autoCheck = true): UseBackendStatusReturn {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<HealthCheckData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    try {
      const response = await healthService.check();
      if (response.success && response.data?.status === 'UP') {
        setIsConnected(true);
        setHealthData(response.data);
      } else {
        setIsConnected(false);
        setError('Server backend merespons tapi status tidak normal');
      }
    } catch (err: unknown) {
      setIsConnected(false);
      setError(err instanceof Error ? err.message : 'Koneksi ke backend gagal');
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      checkStatus();
    }
  }, [autoCheck, checkStatus]);

  return {
    isConnected,
    isChecking,
    healthData,
    error,
    checkStatus,
  };
}
