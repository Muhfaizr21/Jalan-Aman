/**
 * apiClient.ts
 * Core HTTP Client for JalanAman Mobile.
 * Built adhering strictly to SOLID principles:
 * - Single Responsibility: Handles raw HTTP requests, interceptors, timeouts, and JSON envelopes.
 * - Open/Closed: Extensible request options without modifying base fetcher.
 * - Liskov Substitution: Uniform typed response contracts.
 * - Dependency Inversion: Injects token storage interface rather than hardcoding storage engines.
 */

import { API_CONFIG } from './apiConfig';
import { tokenStorage, ITokenStorage } from './tokenStorage';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

export class ApiClient {
  private readonly baseUrl: string;
  private readonly storage: ITokenStorage;

  constructor(baseUrl: string = API_CONFIG.baseUrl, storage: ITokenStorage = tokenStorage) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.storage = storage;
  }

  private async buildHeaders(options: RequestOptions): Promise<HeadersInit> {
    const headers: Record<string, string> = {
      ...API_CONFIG.headers,
      ...(options.headers as Record<string, string>),
    };

    if (!options.skipAuth) {
      const token = await this.storage.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}/${endpoint.replace(/^\/+/, '')}`;
    const timeout = options.timeout ?? API_CONFIG.timeoutMs;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);

    try {
      const headers = await this.buildHeaders(options);
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timer);

      // Parse JSON safely
      let json: ApiResponse<T>;
      const text = await response.text();
      try {
        json = text ? JSON.parse(text) : ({} as ApiResponse<T>);
      } catch {
        throw new ApiError(
          `Gagal memproses respons server (Status: ${response.status})`,
          response.status,
          text
        );
      }

      if (!response.ok || json.success === false) {
        const errorMsg = json.message || `Request gagal dengan status ${response.status}`;
        throw new ApiError(errorMsg, response.status, json.errors || json);
      }

      return json;
    } catch (err: unknown) {
      clearTimeout(timer);
      if (err instanceof ApiError) {
        throw err;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError('Koneksi ke server timeout (melebihi batas waktu)', 408);
      }
      throw new ApiError(
        err instanceof Error ? err.message : 'Terjadi kegagalan jaringan',
        0,
        err
      );
    }
  }

  public async get<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public async delete<T = unknown>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Global Singleton Instance
export const apiClient = new ApiClient();
