/**
 * tokenStorage.ts
 * Clean architecture adapter for persisting JWT session tokens across Web and Native.
 * Adheres to SOLID Dependency Inversion Principle (DIP).
 */

import { Platform } from 'react-native';

export interface ITokenStorage {
  getToken(): Promise<string | null>;
  setToken(token: string): Promise<void>;
  clearToken(): Promise<void>;
}

class MemoryTokenStorage implements ITokenStorage {
  private inMemoryToken: string | null = null;

  async getToken(): Promise<string | null> {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        return window.localStorage.getItem('jalanaman_jwt_token');
      } catch {
        return this.inMemoryToken;
      }
    }
    return this.inMemoryToken;
  }

  async setToken(token: string): Promise<void> {
    this.inMemoryToken = token;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.setItem('jalanaman_jwt_token', token);
      } catch {
        // Fallback to memory
      }
    }
  }

  async clearToken(): Promise<void> {
    this.inMemoryToken = null;
    if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem('jalanaman_jwt_token');
      } catch {
        // Ignored
      }
    }
  }
}

export const tokenStorage: ITokenStorage = new MemoryTokenStorage();
