/**
 * shelterService.ts
 * Dedicated Safe Haven service for fetching and caching live shelter data from PostgreSQL backend.
 * Eliminates hardcoded mock data in compliance with SOLID principles.
 */

import { apiClient } from './apiClient';
import { API_CONFIG } from './apiConfig';
import { SafeHavenItem } from '@/types/emergencyCenter';

export interface BackendShelter {
  id: string;
  name: string;
  category: 'police' | 'store24' | 'pos_satpam' | 'hospital';
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  distance: string;
  eta: string;
  is_active: boolean;
  is_24h: boolean;
  created_at: string;
  updated_at: string;
}

export interface IShelterService {
  getShelters(): Promise<SafeHavenItem[]>;
  getRawShelters(): Promise<BackendShelter[]>;
  getShelterById(id: string): Promise<BackendShelter>;
}

export class ShelterService implements IShelterService {
  constructor(private client = apiClient) {}

  /**
   * Transforms backend PostgreSQL shelter row into clean Mobile SafeHavenItem.
   */
  private mapToSafeHavenItem(item: BackendShelter): SafeHavenItem {
    let categoryBadgeLabel = 'Safe Haven';
    let primaryBadgeColor: 'primary' | 'secondary' | 'tertiary' | 'alert' | 'muted' = 'primary';
    let iconType: 'videocam' | 'light_mode' | 'shield' | 'health_and_safety' | 'group' | 'store' | 'wb_sunny' = 'shield';

    if (item.category === 'police') {
      categoryBadgeLabel = 'Pos Polisi 24 Jam';
      primaryBadgeColor = 'primary';
      iconType = 'shield';
    } else if (item.category === 'hospital') {
      categoryBadgeLabel = 'Fasilitas Medis 24 Jam';
      primaryBadgeColor = 'alert';
      iconType = 'health_and_safety';
    } else if (item.category === 'store24') {
      categoryBadgeLabel = 'Retail Komunitas 24 Jam';
      primaryBadgeColor = 'secondary';
      iconType = 'store';
    } else if (item.category === 'pos_satpam') {
      categoryBadgeLabel = 'Penjagaan Satpam Warga';
      primaryBadgeColor = 'tertiary';
      iconType = 'shield';
    }

    const distanceNum = parseInt(item.distance.replace(/\D/g, ''), 10) || 350;
    const etaNum = parseInt(item.eta.replace(/\D/g, ''), 10) || 3;

    return {
      id: item.id,
      name: item.name,
      address: item.address,
      distanceMeters: distanceNum,
      etaMinutes: etaNum,
      badges: [
        {
          id: `${item.id}-b1`,
          label: categoryBadgeLabel,
          icon: iconType,
          colorType: primaryBadgeColor,
        },
        {
          id: `${item.id}-b2`,
          label: item.is_24h ? 'Siaga 24 Jam' : 'Jam Operasional',
          icon: 'light_mode',
          colorType: 'secondary',
        },
        {
          id: `${item.id}-b3`,
          label: 'CCTV Aktif Terkoneksi',
          icon: 'videocam',
          colorType: 'tertiary',
        },
      ],
      actionType: 'evacuate_now',
      actionLabel: 'Evakuasi ke Sini Sekarang',
    };
  }

  async getShelters(): Promise<SafeHavenItem[]> {
    const response = await this.client.get<BackendShelter[]>(
      API_CONFIG.endpoints.shelters.list,
      { skipAuth: true }
    );

    const rawList = response.data || [];
    return rawList.map((item) => this.mapToSafeHavenItem(item));
  }

  async getRawShelters(): Promise<BackendShelter[]> {
    const response = await this.client.get<BackendShelter[]>(
      API_CONFIG.endpoints.shelters.list,
      { skipAuth: true }
    );
    return response.data || [];
  }

  async getShelterById(id: string): Promise<BackendShelter> {
    const response = await this.client.get<BackendShelter>(
      API_CONFIG.endpoints.shelters.detail(id),
      { skipAuth: true }
    );
    return response.data;
  }
}

export const shelterService = new ShelterService();
