import { inject } from "vue"
import { defineStore } from "pinia"
import { useRouter } from "vue-router"

import { useApi } from "@/composables/useApi"

export const useAuthStore = defineStore("auth", {
    state: () => ({
        access_token: localStorage.getItem('access_token'),
        endpoint: inject('endpoint'),
        axios: useApi(true),
        router: useRouter(),
    }),
    getters: {
        token: (state) => state.access_token,
    },
    actions: {
        async oauthLogin(code: string) {
            const { axios } = this.axios
            const validate_response = await axios.post(
                `${this.endpoint}/auth/oauth/google/verify`,
                { code },
            )
            const { access_token }: { access_token: string } = validate_response.data.data
            this.access_token = access_token
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
        async logout() {
            const { axios } = this.axios
            try {
                await axios.post(`${this.endpoint}/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${this.access_token}`
                    },
                })
            } catch (error) {
                console.error('Error during logout:', error)
            } finally {
                this.access_token = null;
                localStorage.removeItem('access_token')
                this.router.push({ name: 'home' })
            }
        }
    },
})