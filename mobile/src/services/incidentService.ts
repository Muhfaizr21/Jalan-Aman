/**
 * incidentService.ts
 * Clean architecture service for incident reporting, community safety feed, and hazard telemetry.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface BackendIncident {
  id: string;
  category: string;
  title: string;
  description: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  status: 'Pending' | 'Verified' | 'Rejected';
  reported_at: string;
}

export interface CreateIncidentPayload {
  category: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  address: string;
  severity?: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export interface IIncidentService {
  getIncidents(): Promise<BackendIncident[]>;
  reportIncident(payload: CreateIncidentPayload): Promise<BackendIncident>;
  getIncidentById(id: string): Promise<BackendIncident>;
}

export class IncidentService implements IIncidentService {
  constructor(private client = apiClient) {}

  async getIncidents(): Promise<BackendIncident[]> {
    const response = await this.client.get<BackendIncident[]>(
      API_CONFIG.endpoints.incidents.list,
      { skipAuth: true }
    );
    return response.data || [];
  }

  async reportIncident(payload: CreateIncidentPayload): Promise<BackendIncident> {
    const response = await this.client.post<BackendIncident>(
      API_CONFIG.endpoints.incidents.create,
      {
        ...payload,
        severity: payload.severity || 'Moderate',
      }
    );
    return response.data;
  }

  async getIncidentById(id: string): Promise<BackendIncident> {
    const response = await this.client.get<BackendIncident>(
      API_CONFIG.endpoints.incidents.detail(id),
      { skipAuth: true }
    );
    return response.data;
  }
}

export const incidentService = new IncidentService();
