/**
 * tripService.ts
 * Clean architecture service communicating with JalanAman Go Backend for Trip Protection,
 * E2EE Telemetry, and Auto-Purge of Trip History.
 */

import { apiClient, ApiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface Trip {
  id: string;
  user_id: string;
  origin_name: string;
  destination_name: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
  status: 'active' | 'completed' | 'cancelled';
  is_encrypted: boolean;
  start_time: string;
  arrived_at?: string | null;
  created_at: string;
}

export interface TripTelemetry {
  id: string;
  trip_id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  encrypted_payload?: string;
  speed_kmh: number;
  recorded_at: string;
}

export interface StartTripParams {
  origin_name: string;
  destination_name: string;
  origin_lat: number;
  origin_lng: number;
  dest_lat: number;
  dest_lng: number;
}

export interface RecordTelemetryParams {
  trip_id: string;
  latitude: number;
  longitude: number;
  speed_kmh: number;
}

export interface ITripService {
  startTrip(params: StartTripParams): Promise<Trip>;
  recordTelemetry(params: RecordTelemetryParams): Promise<TripTelemetry>;
  completeTrip(tripId: string): Promise<Trip>;
  getActiveTrip(): Promise<Trip | null>;
  getHistory(): Promise<Trip[]>;
}

export class TripService implements ITripService {
  constructor(private client: ApiClient = apiClient) {}

  async startTrip(params: StartTripParams): Promise<Trip> {
    const response = await this.client.post<Trip>(
      API_CONFIG.endpoints.trips.start,
      params
    );
    return response.data;
  }

  async recordTelemetry(params: RecordTelemetryParams): Promise<TripTelemetry> {
    const response = await this.client.post<TripTelemetry>(
      API_CONFIG.endpoints.trips.telemetry,
      params
    );
    return response.data;
  }

  async completeTrip(tripId: string): Promise<Trip> {
    const response = await this.client.post<Trip>(
      API_CONFIG.endpoints.trips.complete,
      { trip_id: tripId }
    );
    return response.data;
  }

  async getActiveTrip(): Promise<Trip | null> {
    try {
      const response = await this.client.get<Trip>(API_CONFIG.endpoints.trips.active);
      return response.data;
    } catch {
      return null;
    }
  }

  async getHistory(): Promise<Trip[]> {
    const response = await this.client.get<Trip[]>(API_CONFIG.endpoints.trips.history);
    return response.data || [];
  }
}

export const tripService = new TripService();
