/**
 * healthService.ts
 * Verifies live connection to JalanAman Backend API Gateway.
 */

import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface HealthCheckData {
  status: 'UP' | 'DOWN';
  database: string;
  version: string;
}

export class HealthService {
  constructor(private client = apiClient) {}

  async check(): Promise<ApiResponse<HealthCheckData>> {
    return this.client.get<HealthCheckData>(API_CONFIG.endpoints.health, {
      skipAuth: true,
      timeout: 5000,
    });
  }
}

export const healthService = new HealthService();
