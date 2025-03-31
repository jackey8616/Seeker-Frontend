<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
</script>

<template>
  <div class="home-container">
    <v-row justify="center" align="center" class="text-center">
      <v-col cols="12" md="8">
        <v-card class="welcome-card pa-6">
          <v-icon
            icon="mdi-briefcase-search"
            size="64"
            color="primary"
            class="mb-4"
          ></v-icon>
          
          <h1 class="text-h3 mb-4">Welcome to Seeker</h1>
          <p class="text-h6 text-medium-emphasis mb-6">
            Your AI-Powered Job Search Assistant
          </p>

          <v-divider class="my-6"></v-divider>

          <div v-if="!authStore.isLogin()" class="text-center">
            <p class="text-body-large mb-4">
              Get started by signing in with your Google account to access all features:
            </p>
            <ul class="text-left mb-6">
              <li>Smart job recommendations</li>
              <li>Email integration for job applications</li>
              <li>Conversation history with AI</li>
              <li>Personalized user dashboard</li>
            </ul>
            <v-btn
              color="primary"
              size="large"
              prepend-icon="mdi-google"
              class="mt-4"
            >
              Sign in with Google
            </v-btn>
          </div>

          <div v-else class="text-center">
            <p class="text-body-large mb-4">
              You're all set! Here's what you can do:
            </p>
            <v-row>
              <v-col cols="12" sm="6" md="3">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-briefcase" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Jobs</div>
                  <div class="text-body-2 text-medium-emphasis">Browse and apply for jobs</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-email" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Mail</div>
                  <div class="text-body-2 text-medium-emphasis">Manage job-related emails</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-chat" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Conversations</div>
                  <div class="text-body-2 text-medium-emphasis">View AI chat history</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="6" md="3">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-account" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Profile</div>
                  <div class="text-body-2 text-medium-emphasis">Manage your account</div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100%;
  display: flex;
  align-items: center;
  padding: 24px;
}

.welcome-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.feature-card {
  height: 100%;
  padding: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

ul {
  list-style-type: none;
  padding: 0;
}

ul li {
  margin-bottom: 8px;
  padding-left: 24px;
  position: relative;
}

ul li:before {
  content: "•";
  color: var(--v-primary-base);
  position: absolute;
  left: 0;
}
</style>
