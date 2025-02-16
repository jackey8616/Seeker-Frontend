<script setup lang="ts">
import GoogleOAuthBtn from '@/components/GoogleOAuthBtn.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>

<template>
  <div>
    <GoogleOAuthBtn></GoogleOAuthBtn>
    <v-btn
      v-if="authStore.isLogin()"
      prepend-icon="$logout"
      @click="authStore.logout()"
    >Logout</v-btn>
  </div>  
</template>
