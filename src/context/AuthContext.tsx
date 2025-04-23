import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import authService from '../services/authService';
import { UserPermission, UserRole } from '../types/types';

// User interface
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: UserRole;
}

// AuthState interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userPermissions: UserPermission[];
  error: string | null;
}

// AuthResponse interface
interface AuthResponse<T = void> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// AuthContextType interface
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthResponse<{
    user: User;
    permissions: UserPermission[];
  }>>;
  logout: () => Promise<AuthResponse>;
  getCurrentUser: () => Promise<AuthResponse<{
    user: User;
    permissions: UserPermission[];
  }>>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse<{
    user: User;
    permissions: UserPermission[];
  }>>;
  resetPassword: (email: string) => Promise<AuthResponse>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userPermissions: [],
  error: null,
};

// Create context
export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => ({
    success: false,
    message: 'Login not implemented',
    error: 'Login method not initialized',
  }),
  logout: async () => ({
    success: false,
    message: 'Logout not implemented',
    error: 'Logout method not initialized',
  }),
  register: async () => ({
    success: false,
    message: 'Register not implemented',
    error: 'Register method not initialized',
  }),
  resetPassword: async () => ({
    success: false,
    message: 'Reset password not implemented',
    error: 'Reset password method not initialized',
  }),
  getCurrentUser: async () => ({
    success: false,
    message: 'Get current user not implemented',
    error: 'Get current user method not initialized',
  }),
  clearError: () => {},
  checkAuth: async () => {},
});

// AuthProvider props interface
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  // Check if user is already authenticated on mount
  const checkAuth = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          userPermissions: response.data.permissions || [],
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          userPermissions: [],
          error: response.error || null,
        });
      }
    } catch (error) {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        userPermissions: [],
        error: error instanceof Error ? error.message : 'Authentication failed',
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: User; permissions: UserPermission[] }>> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          userPermissions: response.data.permissions || [],
          error: null,
        });
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        message: 'Login failed',
        error: errorMessage,
      };
    }
  };

  const logout = async (): Promise<AuthResponse> => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.logout();
      if (response.success) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          userPermissions: [],
          error: null,
        });
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        message: 'Logout failed',
        error: errorMessage,
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse<{ user: User; permissions: UserPermission[] }>> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.register(name, email, password);
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          userPermissions: response.data.permissions || [],
          error: null,
        });
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        message: 'Registration failed',
        error: errorMessage,
      };
    }
  };

  const resetPassword = async (email: string): Promise<AuthResponse> => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.resetPassword(email);
      setState((prev) => ({ ...prev, isLoading: false }));
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Password reset failed';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        message: 'Password reset failed',
        error: errorMessage,
      };
    }
  };

  // Add getCurrentUser implementation
  const getCurrentUser = async (): Promise<
    AuthResponse<{ user: User; permissions: UserPermission[] }>
  > => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await authService.getCurrentUser();
      if (response.success && response.data) {
        setState({
          user: response.data.user,
          isAuthenticated: true,
          isLoading: false,
          userPermissions: response.data.permissions || [],
          error: null,
        });
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          userPermissions: [],
          error: response.error || null,
        });
      }
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch current user';
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      return {
        success: false,
        message: 'Failed to fetch current user',
        error: errorMessage,
      };
    }
  };

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  const contextValue: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    resetPassword,
    getCurrentUser,
    clearError,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easier context usage
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};