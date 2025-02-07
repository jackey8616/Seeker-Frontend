import { inject, onMounted, ref } from "vue";
import axios, { Axios, type CreateAxiosDefaults } from "axios";

import { useAuthStore } from "@/stores/auth";

export function useApi(isOAuthRequest?: boolean) {
  const endpoint = inject('endpoint')
  const authStore = useAuthStore()
  const axiosInstance = ref<Axios>(axios.create());
  const error = ref<Error | null>(null);

  function setupRefreshTokenRetry(axiosInstance: Axios) {
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (err) => {
        const originalRequest = err.config
        if (
          err.response.status == 401
          && err.response.data.detail == "Expired token."
          && !originalRequest._retry
        ) {
          authStore.refresh()
          originalRequest._retry = true
          return axiosInstance.request(originalRequest)
        }
        return Promise.reject(err)
      },
    );
  }

  onMounted(async () => {
    if (!isOAuthRequest && authStore.isLogin() === false) {
      error.value = new Error(`Not login yet.`)
      return
    }

    const payload: CreateAxiosDefaults = {
      baseURL: `${endpoint}/`,
      withCredentials: true,
    }
    if (!isOAuthRequest) {
      payload.headers = { 'Authorization': `Bearer ${authStore.token}`}
    }

    axiosInstance.value = axios.create(payload)
    if (!isOAuthRequest) {
      setupRefreshTokenRetry(axiosInstance.value)
    }
  });

  return { axios: axiosInstance, error }
}