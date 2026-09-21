/**
 * authService.ts
 * Clean architecture authentication and profile service handling both tracks:
 * - Role: User (Mobile Application)
 * - Role: Superadmin (Web Command Center & Administration)
 */

import { apiClient, ApiResponse } from './apiClient';
import { API_CONFIG } from './apiConfig';
import { tokenStorage, ITokenStorage } from './tokenStorage';

export type UserRole = 'User' | 'Admin' | 'Superadmin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  domicile?: string;
  blood_type?: string;
  allergies?: string;
  medical_notes?: string;
  emergency_hospital?: string;
  guardian_name?: string;
  guardian_phone?: string;
  avatar_url?: string;
  role: UserRole;
  status: string;
  trust_score: number;
  created_at?: string;
  updated_at?: string;
}

export interface AuthResponseData {
  token: string;
  user: UserProfile;
  expires_at: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string;
  domicile: string;
  blood_type: string;
  allergies: string;
  medical_notes: string;
  emergency_hospital: string;
  guardian_name: string;
  guardian_phone: string;
  avatar_url?: string;
}

export interface IAuthService {
  login(credentials: LoginPayload): Promise<AuthResponseData>;
  register(payload: RegisterPayload): Promise<AuthResponseData>;
  logout(): Promise<void>;
  getProfile(): Promise<UserProfile>;
  updateProfile(payload: UpdateProfilePayload): Promise<UserProfile>;
  deleteAccount(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
}

export class AuthService implements IAuthService {
  constructor(
    private client = apiClient,
    private storage: ITokenStorage = tokenStorage
  ) {}

  /**
   * Login for both Mobile Users and Superadmins.
   */
  async login(credentials: LoginPayload): Promise<AuthResponseData> {
    const response = await this.client.post<AuthResponseData>(
      API_CONFIG.endpoints.auth.login,
      credentials,
      { skipAuth: true }
    );

    if (response.data?.token) {
      await this.storage.setToken(response.data.token);
    }

    return response.data;
  }

  /**
   * User registration track specifically for Mobile public users.
   */
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await this.client.post<AuthResponseData>(
      API_CONFIG.endpoints.auth.register,
      payload,
      { skipAuth: true }
    );

    if (response.data?.token) {
      await this.storage.setToken(response.data.token);
    }

    return response.data;
  }

  /**
   * Logout user and revoke local JWT session token.
   */
  async logout(): Promise<void> {
    try {
      await this.client.post(API_CONFIG.endpoints.auth.logout, {});
    } catch {
      // Ignored if network fails on logout
    } finally {
      await this.storage.clearToken();
    }
  }

  /**
   * Retrieves verified authenticated user profile.
   */
  async getProfile(): Promise<UserProfile> {
    const response = await this.client.get<UserProfile>(API_CONFIG.endpoints.auth.me);
    return response.data;
  }

  /**
   * Update authenticated user's profile and medical ID.
   */
  async updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
    const response = await this.client.put<UserProfile>(
      API_CONFIG.endpoints.users.profile,
      payload
    );
    return response.data;
  }

  /**
   * Delete user account permanently.
   */
  async deleteAccount(): Promise<void> {
    await this.client.delete(API_CONFIG.endpoints.users.account);
    await this.storage.clearToken();
  }

  /**
   * Quick check whether a valid local token exists.
   */
  async isAuthenticated(): Promise<boolean> {
    const token = await this.storage.getToken();
    return !!token;
  }
}

export const authService = new AuthService();
