import {create} from 'zustand';

interface NavigationState {
  isNavigationReady: boolean;
  isAuthenticated: boolean;
  userName: string | null;

  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsNavigationReady: (isNavigationReady: boolean) => void;
  setUsername: (userName: string | null) => void;
}

const useNavigationStateStore = create<NavigationState>(set => ({
  isNavigationReady: false, // Initial state value for navigation readiness
  isAuthenticated: false, // Initial state value for authentication
  userName: null, // Initial state value for username

  // Action to set the authentication status
  setIsAuthenticated: (isAuthenticated: boolean) => set({isAuthenticated}),

  // Action to set the navigation ready state
  setIsNavigationReady: (isNavigationReady: boolean) =>
    set({isNavigationReady}),

  // Action to set the username
  setUsername: (userName: string | null) => set({userName}),
}));

export default useNavigationStateStore;
