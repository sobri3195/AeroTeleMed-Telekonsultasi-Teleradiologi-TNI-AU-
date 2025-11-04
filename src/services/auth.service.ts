import { apiService } from './api';
import { User } from '../types';

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  user: User;
  expires_in: number;
}

export interface LoginRequest {
  username: string;
  password: string;
  otp: string;
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  },

  async logout(): Promise<void> {
    await apiService.post('/auth/logout');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  async refreshToken(): Promise<LoginResponse> {
    const refreshToken = localStorage.getItem('refresh_token');
    return apiService.post<LoginResponse>('/auth/refresh', { refresh_token: refreshToken });
  },

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/auth/me');
  },

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await apiService.post('/auth/change-password', { old_password: oldPassword, new_password: newPassword });
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  saveRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
  },

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },
};
