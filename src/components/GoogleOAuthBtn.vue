<script setup lang="ts">
import { inject } from 'vue';
import { googleSdkLoaded } from 'vue3-google-login';
import axios from 'axios';

import { useAuthStore } from '@/stores/auth';

const endpoint = inject('endpoint')
const authStore = useAuthStore()

const generateState = () => {
  const array = new Uint32Array(1)
  const state = crypto.getRandomValues(array)[0].toString(36)
  sessionStorage.setItem('google_oauth_state', state)
  return state
}

const compareState = (state: string) => {
  const sessionState = sessionStorage.getItem('google_oauth_state')
  if (sessionState != state) throw new Error("Potential CSRF risk, state is mismatched!")
  sessionStorage.removeItem('google_oauth_state')
}

const fetchGoogleConfigurations = async () => {
  const response = await axios.get(`${endpoint}/auth/oauth/google/config`)
  const data = response.data.data
  return {
    clientId: data["client_id"],
    redirectUri: data["redirect_uri"],
    scope: data["scopes"].join(" "),
  }
}

const handleGoogleAuthCodeLogin = async (include_granted_scopes = false) => {
  const state = generateState()
  const {
    clientId: client_id,
    redirectUri: redirect_uri,
    scope,
  } = await fetchGoogleConfigurations()

  googleSdkLoaded((google) => {
    google.accounts.oauth2.initCodeClient({
      include_granted_scopes,
      client_id,
      redirect_uri,
      scope,
      state,
      callback: async (response: any) => {
        /* CodePopupResponse missed state, thus cast to any */
        const { state: responseState, code } = response as any
        compareState(responseState)

        authStore.oauthLogin(code)
      },
    } as any).requestCode()
  })
}
</script>

<template>
  <div v-if="authStore.isAuthenticated === false">
    <v-btn prepend-icon="mdi-google" @click="handleGoogleAuthCodeLogin">使用 Google 進行登入</v-btn>
  </div>
</template>
