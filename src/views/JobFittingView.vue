<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';

import type ApiClient from '@/composables/apiClient';
import type { ApiResponseDto, Job, JobResponse } from '@/type';
import ChatLogDetail from '@/components/ChatLogDetail.vue';
import { useDate } from 'vuetify';

const apiClient = inject('apiClient') as ApiClient;
const date = useDate()
const props = defineProps<{ job_id: string; expand_chat_log_id?: string; }>()

const job = ref<Job | null>(null)
const tabId = ref(0)
const expand_job = ref<string[]>([])
const expand_chat_logs = ref<string[]>([])
const invoke_debounce = ref(false)
const restriction = ref('')
const resume = ref('')
const invoke_results = ref()

async function fetchJob(job_id: string) {
  try {
    const { data }: ApiResponseDto<JobResponse> = await apiClient.client.get(`/jobs/${job_id}`)
        .then(({ data }) => data)
    job.value = data.job
  } catch (error) {
    console.error('Error fetching job:', error)
  }
}

async function invoke_ai(job: Job) {
  invoke_debounce.value = true
  const response = await apiClient.client.post(
    `/jobs/fitting_by_ai/${job.id}`,
    {
      restriction: restriction.value,
      resume: resume.value,
    },
  )
  .then((response) => response)
  .catch((error) => error)
  .finally(() => invoke_debounce.value = false)
  invoke_results.value = response.data.result
}

onMounted(() => {
  fetchJob(props.job_id)
  if (props.expand_chat_log_id) {
    expand_job.value.push('chat_logs')
    expand_chat_logs.value.push(props.expand_chat_log_id)
  }
})
</script>

<template>
  <div class="d-flex split-layout">
    <!-- Left Column: Job Details -->
    <div class="section pa-4">
      <v-card v-if="job !== null">
        <v-card-title class="text-h5">
          {{ job.title }}
          <v-btn icon="mdi-link">
            <a :href="job.url" target="_blank">Link</a>
            <v-tooltip activator="parent" location="bottom">Open job in another tab</v-tooltip>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <div class="text-subtitle-1 mb-2">
            <v-icon icon="mdi-currency-usd" class="mr-1"></v-icon>
            {{ job.salary }}
          </div>
          <div class="text-subtitle-1 mb-2">
            <v-icon icon="mdi-briefcase" class="mr-1"></v-icon>
            <a :href="job.company.link" target="_blank">{{ job.company.name }}</a>
          </div>
          <div class="text-subtitle-1 mb-2">
            <v-icon icon="mdi-map-marker" class="mr-1"></v-icon>
            {{ job.location }}
          </div>
          <v-divider class="my-4"></v-divider>
          <v-expansion-panels v-model="expand_job">
            <v-expansion-panel value="description">
                <v-expansion-panel-title>
                <strong>Description</strong>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                    <div v-html="job.raw_description"></div>
                </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel value="chat_logs">
              <v-expansion-panel-title>
                <strong>Chat Logs</strong>
                <template #actions>
                  <v-chip size="small" class="ml-2">{{ job.chat_logs?.length || 0 }} conversations</v-chip>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <v-expansion-panels v-model="expand_chat_logs" >
                  <v-expansion-panel
                    v-for="(chat, index) in job.chat_logs"
                    :key="index"
                    :value="chat.id"
                  >
                    <v-expansion-panel-title>
                      <v-chip size="small" color="primary" class="mr-2">
                        {{ date.format(chat.start_datetime, 'keyboardDateTime24h') }}
                      </v-chip>
                      <strong>Conversation {{ index + 1 }}</strong>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <ChatLogDetail :chat="chat" :expand="chat.id" />
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
      <v-card v-else>
        <v-card-text class="text-center">
          <v-progress-circular indeterminate></v-progress-circular>
        </v-card-text>
      </v-card>
    </div>

    <!-- Right Column: Fitting Form -->
    <div class="section pa-4">
      <v-card>
        <v-card-title class="text-h6">
          Job Fitting
        </v-card-title>
        <v-card-text>
          <v-textarea
            v-model="restriction"
            label="Restriction"
            rows="5"
            class="mb-4"
          ></v-textarea>
          <v-textarea
            v-model="resume"
            label="Resume"
            rows="15"
            class="mb-4"
          ></v-textarea>
          <v-btn
            v-if="job !== null"
            @click="invoke_ai(job)"
            prepend-icon="mdi-brain"
            :disabled="invoke_debounce || !job"
            color="primary"
            block
          >AI Invoke</v-btn>
        </v-card-text>
      </v-card>

      <!-- Results Section -->
      <v-card v-if="invoke_results" class="mt-4">
        <v-card-title class="text-h6">
          Fitting Results
        </v-card-title>
        <v-card-text>
          <v-tabs v-model="tabId" direction="vertical">
            <v-tab
              prepend-icon="mdi-account-check"
              v-for="(_, idx) in invoke_results"
              :value="idx"
            >Result {{ idx + 1 }}</v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabId" class="flex-grow-1">
            <v-tabs-window-item v-for="(result, idx) in invoke_results" :value="idx">
              <div style="overflow-y: auto; height: 100%;">
                <v-textarea :value="result.response" rows="15"></v-textarea>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped>
.split-layout {
  height: 100vh;
  overflow: hidden;
}

.section {
  width: 50%;
  min-width: 50%;
  max-width: 50%;
  overflow-y: auto;
}
</style> 