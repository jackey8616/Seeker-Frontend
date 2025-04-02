import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const OAUTH_VERIFY_URL = `${API_BASE_URL}/auth/oauth/google/verify`;
const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;

const getAccessTokenFromStorage = () => {
    return localStorage.getItem('accessToken');
};

export const useAuthStore = defineStore('auth', {
    // --- State ---
    state: () => ({
        accessToken: getAccessTokenFromStorage() || null,
        user: null,
        isRefreshing: false,
        refreshSubscribers: [] as ((newAccessToken: string) => void)[],
    }),

    // --- Getters ---
    getters: {
        getAccessToken: (state) => state.accessToken,
        isAuthenticated: (state) => !!state.accessToken,
    },

    // --- Actions ---
    actions: {
        setAccessToken(accessToken: string) {
            console.debug("AuthStore: Setting access token");
            this.accessToken = accessToken;
            localStorage.setItem('accessToken', accessToken);
        },

        clearTokens() {
            console.debug("AuthStore: Clearing tokens");
            this.accessToken = null;
            this.user = null;
            localStorage.removeItem('accessToken');
            this.isRefreshing = false;
            this.refreshSubscribers = [];
        },

        async oauthLogin(code: string) {
            this.clearTokens();
            try {
                console.debug("AuthStore: Performing OAuth login via plain axios");
                const response = await axios.post(OAUTH_VERIFY_URL, { code }, { withCredentials: true });

                const { access_token } = response.data.data;

                if (!access_token) {
                     throw new Error("Access token not received from OAuth login.");
                }

                this.setAccessToken(access_token);
                return true;

            } catch (error: any) {
                console.error('AuthStore: OAuth Login failed:', error.response?.data || error.message);
                this.clearTokens();
                return false;
            }
        },

        async refresh(): Promise<string> {
            if (this.isRefreshing) {
                console.debug("AuthStore: Refresh already in progress, adding request to queue.");
                return new Promise<string>(resolve => {
                    this.addRefreshSubscriber(resolve);
                });
            }

            this.isRefreshing = true;
            console.debug("AuthStore: Attempting token refresh via plain axios");

            try {
                const response = await axios.post(REFRESH_URL, {}, { withCredentials: true });

                const { access_token } = response.data.data;

                if (!access_token) {
                    throw new Error("Access token not received from refresh endpoint.");
                }

                console.debug("AuthStore: Token refresh successful.");
                this.setAccessToken(access_token);
                this.onRefreshSuccess(access_token);

                return access_token;

            } catch (error: any) {
                console.error('AuthStore: Token refresh failed:', error.response?.data || error.message);
                this.onRefreshError(error);
                this.logout();
                return Promise.reject(error);
            } finally {
                this.isRefreshing = false;
            }
        },

        async logout() {
            console.debug("AuthStore: Initiating logout process.");
            if (this.accessToken) {
                 try {
                     console.debug("AuthStore: Calling backend logout endpoint (using plain axios)");
                    await axios.post(LOGOUT_URL, {}, {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        },
                        withCredentials: true,
                     });
                 } catch (error: any) {
                     console.debug('AuthStore: Backend logout API call failed:', error.response?.data || error.message);
                 }
            }

            this.clearTokens();
            console.debug("AuthStore: Frontend logout complete. Navigation should be handled by caller.");
        },

        addRefreshSubscriber(callback: (newAccessToken: string) => void) {
            this.refreshSubscribers.push(callback);
        },
        onRefreshSuccess(newAccessToken: string) {
            console.debug("AuthStore: Notifying refresh subscribers about success.");
            this.refreshSubscribers.forEach((callback: (newAccessToken: string) => void) => callback(newAccessToken));
            this.refreshSubscribers = [];
        },
         onRefreshError(error: any) {
            console.debug("AuthStore: Notifying refresh subscribers about failure.");
             this.refreshSubscribers = [];
         }
    },
});