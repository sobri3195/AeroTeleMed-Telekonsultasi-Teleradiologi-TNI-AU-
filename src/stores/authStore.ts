import { create } from 'zustand';
import { AuthState } from '../types';
import { authService } from '../services/auth.service';

export const useAuthStore = create<AuthState>((set) => ({
  user: authService.getStoredUser(),
  token: authService.getToken(),
  isAuthenticated: !!authService.getToken(),

  login: async (username: string, password: string, otp: string) => {
    try {
      const response = await authService.login({ username, password, otp });
      authService.saveToken(response.access_token);
      authService.saveRefreshToken(response.refresh_token);
      authService.saveUser(response.user);
      
      set({
        user: response.user,
        token: response.access_token,
        isAuthenticated: true,
      });
    } catch (error) {
      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },
}));
