import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User, UserRole } from '@/types';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    switchRole: (state, action: PayloadAction<UserRole>) => {
      if (state.user) {
        state.user.role = action.payload;
        // Also update localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('smp_auth_user', JSON.stringify(state.user));
        }
      }
    },
  },
});

export const { setUser, setToken, logout, setLoading, switchRole } = authSlice.actions;
export default authSlice.reducer;
