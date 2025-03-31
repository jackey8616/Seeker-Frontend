import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_ENDPOINT;

const OAUTH_VERIFY_URL = `${API_BASE_URL}/auth/oauth/google/verify`;
const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;
const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;


const getTokensFromStorage = () => {
    return {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
    };
};

export const useAuthStore = defineStore('auth', {
    // --- State ---
    state: () => ({
        accessToken: getTokensFromStorage().accessToken || null,
        refreshToken: getTokensFromStorage().refreshToken || null,
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
        setTokens({ accessToken, refreshToken }: { accessToken: string, refreshToken: string }) {
            console.log("AuthStore: Setting tokens");
            this.accessToken = accessToken;
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                this.refreshToken = refreshToken;
                localStorage.setItem('refreshToken', refreshToken);
            }
        },

        clearTokens() {
            console.log("AuthStore: Clearing tokens");
            this.accessToken = null;
            this.refreshToken = null;
            this.user = null;
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            this.isRefreshing = false;
            this.refreshSubscribers = [];
        },

        async oauthLogin(code: string) {
            this.clearTokens();
            try {
                console.log("AuthStore: Performing OAuth login via plain axios");
                const response = await axios.post(OAUTH_VERIFY_URL, { code });

                const { access_token, refresh_token } = response.data.data;

                if (!access_token) {
                     throw new Error("Access token not received from OAuth login.");
                }

                this.setTokens({ accessToken: access_token, refreshToken: refresh_token });

                return true;

            } catch (error: any) {
                console.error('AuthStore: OAuth Login failed:', error.response?.data || error.message);
                this.clearTokens();
                return false;
            }
        },

        async refresh(): Promise<string> {
            if (this.isRefreshing) {
                console.log("AuthStore: Refresh already in progress, adding request to queue.");
                return new Promise<string>(resolve => {
                    this.addRefreshSubscriber(resolve);
                });
            }

            if (!this.refreshToken) {
                console.warn('AuthStore: No refresh token available.');
                this.logout();
                return Promise.reject(new Error('No refresh token'));
            }

            this.isRefreshing = true;
            console.log("AuthStore: Attempting token refresh via plain axios");

            try {
                const response = await axios.post(REFRESH_URL, {
                     refreshToken: this.refreshToken,
                });

                const { access_token, refresh_token: new_refresh_token } = response.data.data;

                if (!access_token) {
                    throw new Error("Access token not received from refresh endpoint.");
                }

                console.log("AuthStore: Token refresh successful.");
                this.setTokens({ accessToken: access_token, refreshToken: new_refresh_token || this.refreshToken });

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
            console.log("AuthStore: Initiating logout process.");
            if (this.accessToken) {
                 try {
                     console.log("AuthStore: Calling backend logout endpoint (using plain axios)");
                    await axios.post(LOGOUT_URL, {}, {
                        headers: {
                            'Authorization': `Bearer ${this.accessToken}`
                        }
                     });
                 } catch (error: any) {
                     console.warn('AuthStore: Backend logout API call failed:', error.response?.data || error.message);
                 }
            }

            this.clearTokens();
            console.log("AuthStore: Frontend logout complete. Navigation should be handled by caller.");
        },

        addRefreshSubscriber(callback: (newAccessToken: string) => void) {
            this.refreshSubscribers.push(callback);
        },
        onRefreshSuccess(newAccessToken: string) {
            console.log("AuthStore: Notifying refresh subscribers about success.");
            this.refreshSubscribers.forEach((callback: (newAccessToken: string) => void) => callback(newAccessToken));
            this.refreshSubscribers = [];
        },
         onRefreshError(error: any) {
            console.log("AuthStore: Notifying refresh subscribers about failure.");
             this.refreshSubscribers = [];
         }
    },
});