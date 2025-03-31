<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import GoogleOAuthBtn from "./GoogleOAuthBtn.vue";

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <v-app-bar app :elevation="2">
    <v-app-bar-title>
      <v-icon icon="mdi-briefcase-search" class="mr-2" />
      Seeker
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-btn
      prepend-icon="mdi-home"
      to="/"
      value="home"
      active-color="primary"
    >
      Home
    </v-btn>

    <template v-if="authStore.isLogin()">
      <v-btn
        prepend-icon="mdi-email"
        to="/mails"
        value="mails"
        active-color="primary"
      >
        Mail
      </v-btn>

      <v-btn
        prepend-icon="mdi-account"
        to="/user"
        value="user"
        active-color="primary"
      >
        User
      </v-btn>

      <v-btn
        prepend-icon="mdi-briefcase"
        to="/jobs"
        value="jobs"
        active-color="primary"
      >
        Job
      </v-btn>

      <v-btn
        prepend-icon="mdi-chat"
        to="/conversation-logs"
        value="conversation-logs"
        active-color="primary"
      >
        Conversation Logs
      </v-btn>

      <v-btn
        prepend-icon="mdi-logout"
        @click="handleLogout"
        value="logout"
      >
        Logout
      </v-btn>
    </template>

    <template v-else>
      <GoogleOAuthBtn />
    </template>
  </v-app-bar>
</template>

<style scoped>
.v-btn {
  text-transform: none;
  letter-spacing: normal;
}
</style> 