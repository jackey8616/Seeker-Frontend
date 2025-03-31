<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import GoogleOAuthBtn from "./GoogleOAuthBtn.vue";

const authStore = useAuthStore();

const handleLogout = () => {
  authStore.logout();
};
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item
        prepend-avatar="@/assets/logo.svg"
        title="Seeker"
        subtitle="AI Job Search Assistant"
      ></v-list-item>

      <v-divider></v-divider>

      <v-list-item
        prepend-icon="mdi-home"
        title="Home"
        to="/"
        value="home"
        active-color="primary"
      ></v-list-item>

      <template v-if="authStore.isAuthenticated">
        <v-list-item
          prepend-icon="mdi-email"
          title="Mail"
          to="/mails"
          value="mails"
          active-color="primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-account"
          title="User"
          to="/user"
          value="user"
          active-color="primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-briefcase"
          title="Job"
          to="/jobs"
          value="jobs"
          active-color="primary"
        ></v-list-item>

        <v-list-item
          prepend-icon="mdi-chat"
          title="Conversation Logs"
          to="/conversation-logs"
          value="conversation-logs"
          active-color="primary"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list-item
          prepend-icon="mdi-logout"
          title="Logout"
          @click="handleLogout"
          value="logout"
        ></v-list-item>
      </template>

      <template v-else>
        <v-divider></v-divider>
        <v-list-item>
          <GoogleOAuthBtn />
        </v-list-item>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-navigation-drawer {
  transition: width 0.3s ease-in-out;
}
</style> 