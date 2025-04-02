import axios, { type AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/auth';


export default class ApiClient {
    client: AxiosInstance;

    constructor(config: { baseURL: string; }) {
        this.client = axios.create({
            baseURL: config.baseURL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
            },
        })
    }

    withCredentials() {
        this.client.interceptors.request.use(
            (config) => {
                const authStore = useAuthStore();
                const token = authStore.getAccessToken;

                if (token && !config.headers.skipAuthorization) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                delete config.headers.skipAuthorization;

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
        return this;
    }

    withAutoRefresh() {
        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;
                const authStore = useAuthStore();
        
                if (
                    error.response?.status === 401 &&
                    error.response?.data?.detail === "Expired token." &&
                    !originalRequest._retry
                ) {
                    console.debug('ApiClient: Detected expired token, attempting refresh.');
                    originalRequest._retry = true;
        
                    if (authStore.isRefreshing) {
                        console.debug('ApiClient: Refresh already in progress, waiting...');
                        try {
                            const newToken = await new Promise<string>(resolve => {
                                authStore.addRefreshSubscriber(resolve);
                            });
        
                            console.debug('ApiClient: Refresh completed by another request, retrying original.');
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                            return this.client(originalRequest);
                        } catch (waitError) {
                            console.warn('ApiClient: Waiting for refresh failed.', waitError);
                            return Promise.reject(waitError);
                        }
                    } else {
                        try {
                            console.debug('ApiClient: Initiating token refresh...');
                            const newToken = await authStore.refresh();
                            console.debug('ApiClient: Token refresh successful, retrying original request.');
                            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

                            return this.client(originalRequest);
                        } catch (refreshError) {
                            console.error('ApiClient: Token refresh failed.', refreshError);
                            authStore.logout();
                            return Promise.reject(refreshError);
                        }
                    }
                }
        
                return Promise.reject(error);
            }
        );
        return this;
    }
}
