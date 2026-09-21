/**
 * reputationService.ts
 * Clean architecture service for querying user reputation, trust score, and audit logs.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';

export interface BackendReputationLog {
  id: string;
  user_id: string;
  change_amount: number;
  current_score: number;
  reason: string;
  created_at: string;
}

export interface BackendReputationData {
  user_id: string;
  trust_score: number;
  tier_label: string;
  tier_status: string;
  tier_color: string;
  description: string;
  benefits: string[];
  sos_readiness_rate: number;
  verified_reports_count: number;
  violations_count: number;
  history: BackendReputationLog[];
}

export interface IReputationService {
  getReputation(): Promise<BackendReputationData>;
}

export class ReputationService implements IReputationService {
  constructor(private client = apiClient) {}

  async getReputation(): Promise<BackendReputationData> {
    const response = await this.client.get<BackendReputationData>(
      API_CONFIG.endpoints.users.reputation
    );
    return response.data;
  }
}

export const reputationService = new ReputationService();
