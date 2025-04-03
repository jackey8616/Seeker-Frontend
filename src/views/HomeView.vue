<script setup lang="ts">
import type ApiClient from '@/composables/apiClient';
import { useAuthStore } from '@/stores/auth';
import type { ApiResponseDto, FittingResponse } from '@/type';
import { inject, ref } from 'vue';

const apiClient = inject('apiClient') as ApiClient;
const authStore = useAuthStore()

const showDialog = ref(false)
const formData = ref({
  url: '',
  restriction: '',
  resume: ''
})
const result = ref<FittingResponse | null>(null)
const extractedSummarized = ref('')
const extractedPositiveComment = ref('')
const extractedNegativeComment = ref('')
const extractedFitRate = ref('')
const restrictionPlaceholder = ref(`e.g.
I am base in Taiwan,
don't want to work in gambling industry,
the salary MUST more than 10K TWD/mo.`)
const resumePlaceholder = ref(`e.g.
Mid. Backend Engineer
SomeCompany, Inc.
10/2023 - 05/2024 Taipei, Taiwan
- Maintained and refactored...

Site Reliability Engineer
AnotherCompany, Inc.
10/2022 - 10/2023 Taipei, Taiwan
- Maintained and cost-optimized an AWS-based...
`)

const handleSubmit = async () => {
  showDialog.value = true
}

const extractResponse = async (response: string, key: string) => {
  const regex = new RegExp(`<${key}>(.*?)<\/${key}>`);
  const match = response.match(regex);
  if (match) {
    return match[1];
  }
  return '';
}

const handleDialogSubmit = async () => {
  try {
    const { data }: ApiResponseDto<FittingResponse> = await apiClient.client.post('/jobs/fitting_by_ai/url', formData.value,)
      .then(response => response.data)

    result.value = data
    // Extract and update the values when we get the response
    if (result.value?.ai_response) {
      extractedSummarized.value = await extractResponse(result.value.ai_response, 'summarize')
      extractedPositiveComment.value = await extractResponse(result.value.ai_response, 'positive-comment')
      extractedNegativeComment.value = await extractResponse(result.value.ai_response, 'negative-comment')
      extractedFitRate.value = await extractResponse(result.value.ai_response, 'fit-rate')
    }
  } catch (error) {
    console.error('Error submitting:', error)
  }
}
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

          <div v-if="!authStore.isAuthenticated" class="text-center">
            <p class="text-body-large mb-4">
              Get started by signing in with your Google account to access all features:
            </p>
            <ul class="text-left mb-6">
              <li>Smart job recommendations</li>
              <li>Conversation history with AI</li>
              <li>Personalized user dashboard</li>
            </ul>
          </div>

          <div v-else class="text-center">
            <p class="text-body-large mb-4">
              You're all set! Here's what you can match a job:
            </p>
            
            <v-form @submit.prevent="handleSubmit" class="mb-6">
              <v-text-field
                v-model="formData.url"
                label="Enter your text"
                variant="outlined"
                class="mb-4"
                hide-details
              ></v-text-field>
              <v-btn
                color="primary"
                @click="showDialog = true"
              >
                Submit
              </v-btn>
            </v-form>

            <v-dialog v-model="showDialog" max-width="600px">
              <v-card>
                <v-card-title class="text-h5 pa-4">Match a Job</v-card-title>
                <v-card-text>
                  Currently we takes following platform's job:
                  <ul>
                    <li>Seek(Au)</li>
                    <li>Cake</li>
                  </ul>
                  <v-form @submit.prevent="handleDialogSubmit">
                    <v-text-field
                      v-model="formData.url"
                      label="URL"
                      variant="outlined"
                      class="mb-4"
                      hide-details
                    ></v-text-field>
                    <v-textarea
                      v-model="formData.restriction"
                      label="Restrictions"
                      variant="outlined"
                      class="mb-4"
                      rows="3"
                      :placeholder="restrictionPlaceholder"
                    ></v-textarea>
                    <v-textarea
                      v-model="formData.resume"
                      label="Resume"
                      variant="outlined"
                      class="mb-4"
                      hide-details
                      rows="5"
                      :placeholder="resumePlaceholder"
                    ></v-textarea>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                  <v-row align="center" justify="center">
                    <v-col cols="12" sm="3" md="3">
                      <v-btn
                        color="primary"
                        @click="handleDialogSubmit"
                        :disabled="!formData.url || !formData.restriction || !formData.resume"
                      >{{ result == null ? 'Start Match' : 'Match Again' }}</v-btn>
                    </v-col>
                    <v-col v-if="result != null" cols="12">
                      <v-text-field v-model="extractedFitRate" label="Fit Rate" variant="outlined" class="mb-4" hide-details readonly />
                      <v-textarea
                        v-model="extractedSummarized"
                        label="Response"
                        variant="outlined"
                        class="mb-4"
                        hide-details
                        readonly
                      />
                      <v-textarea
                        v-model="extractedPositiveComment"
                        label="Positive Comment"
                        variant="outlined"
                        class="mb-4"
                        hide-details
                        readonly
                      />
                      <v-textarea
                        v-model="extractedNegativeComment"
                        label="Negative Comment"
                        variant="outlined"
                        class="mb-4"
                        hide-details
                        readonly
                      />
                    </v-col>
                  </v-row>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-row>
              <v-col cols="12" sm="4" md="4">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-briefcase" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Jobs</div>
                  <div class="text-body-2 text-medium-emphasis">Browse and apply for jobs</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-card class="feature-card" variant="outlined">
                  <v-icon icon="mdi-chat" size="32" color="primary" class="mb-2"></v-icon>
                  <div class="text-subtitle-1">Conversations</div>
                  <div class="text-body-2 text-medium-emphasis">View AI chat history</div>
                </v-card>
              </v-col>
              <v-col cols="12" sm="4" md="4">
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
