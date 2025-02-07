import { inject } from "vue"
import { defineStore } from "pinia"

import { useApi } from "@/composables/useApi"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        user_id: localStorage.getItem("user_id"),
        access_token: localStorage.getItem('access_token'),
        endpoint: inject('endpoint'),
        axios: useApi(true),
    }),
    getters: {
        userId: (state) => state.user_id,
        token: (state) => state.access_token,
    },
    actions: {
        async oauthLogin(code: string) {
            const { axios } = this.axios
            const validate_response = await axios.post(
                `${this.endpoint}/auth/oauth/google/verify`,
                { code },
            )
            const {
                access_token,
                user_id,
            }: {
                access_token: string;
                user_id: string;
            } = validate_response.data.data
            this.user_id = user_id
            this.access_token = access_token
            localStorage.setItem('user_id', user_id)
            localStorage.setItem('access_token', access_token)
        },
        async refresh() {
            const { axios } = this.axios
            const refresh_response = await axios.post(`${this.endpoint}/auth/refresh`)
            const { access_token }: { access_token: string } = refresh_response.data.data
            this.access_token = access_token
            localStorage.setItem('access_token', access_token)
        },
        isLogin() {
            return this.access_token !== undefined && this.access_token !== null
        },
        logout() {
            this.user_id = null;
            this.access_token = null;
            localStorage.removeItem('user_id')
            localStorage.removeItem('access_token')
        }
    },
})