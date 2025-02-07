<script setup lang="ts">
import GoogleOAuthBtn from '@/components/GoogleOAuthBtn.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>

<template>
  <div>
    <GoogleOAuthBtn></GoogleOAuthBtn>
    <button v-if="authStore.isLogin()" type="button" @click="authStore.logout()">Logout</button>
  </div>  
</template>
