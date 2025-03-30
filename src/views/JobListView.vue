<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'
import type { ApiResponseDto, Job, JobResponse } from '@/type';


const date = useDate()
const { axios } = useApi()
const router = useRouter()
const headers = ref([
  { title: 'Action', text: 'Action', value: 'action', sortable: false, width: '60px' },
  { title: 'Domain', text: 'Domain', value: 'domain', width: '120px'},
  { title: 'Title', text: 'Title', value: 'title'},
  { title: 'CreatedAt', text: 'CreateTime', value: 'created_at', sortable: true, width: '180px'},
  { title: 'UpdatedAt', text: 'UpdateTime', value: 'updated_at', sortable: true, width: '180px'},
])
const sortBy = ref([{
  "key": 'updated_at',
  "order": 'desc',
}])
const jobs = ref<Job[]>([])
const currentPage = ref(1)
const previousToken = ref<string | null>()
const nextToken = ref<string | null>()
const isLoading = ref(true)
const totalItems = ref(100)
const showDialog = ref(false)
const selectedJob = ref<Job | null>(null)

async function fetchJobs(page = 1) {
  isLoading.value = true
  const payload = page == 1 ? {} : { "page_token": page > currentPage.value ? nextToken.value : previousToken.value }
  
  try {
    const { data }: ApiResponseDto<JobResponse> = await axios.value.post("/jobs", payload).then(({ data }) => data);
    jobs.value = data.jobs
    previousToken.value = data.cursor.previous_page_token
    nextToken.value = data.cursor.next_page_token
    currentPage.value = page
    
    totalItems.value = Math.max(100, jobs.value.length * 5)
  } catch (error) {
    console.error("Error fetching jobs:", error)
  } finally {
    isLoading.value = false
  }
}

async function tableUpdate(options: any) {
  const page = options.page || 1
  await fetchJobs(page)
}

function openJobDialog(job: Job) {
  selectedJob.value = job
  showDialog.value = true
}

function closeJobDialog() {
  showDialog.value = false
  selectedJob.value = null
}

onMounted(async () => {
  await fetchJobs(1)
})
</script>

<template>
  <div>
    <v-data-table-server
      :headers="headers"
      :items="jobs"
      :items-length="totalItems"
      :loading="isLoading"
      items-per-page="20"
      @update:options="tableUpdate"
      class="elevation-1"
    >
      <template #item.action="{ item }">
        <v-btn icon size="small" @click="openJobDialog(item)">
          <v-icon>mdi-eye</v-icon>
          <v-tooltip activator="parent" location="bottom">View Details</v-tooltip>
        </v-btn>
      </template>
      <template #item.domain="{ item }">
        <v-chip size="small">{{ item.domain }}</v-chip>
      </template>
      <template #item.title="{ item }">
        <div class="font-weight-medium">{{ item.title }}</div>
        <div class="text-caption text-truncate" style="max-width: 300px;">
          {{ item.description || 'No description' }}
        </div>
      </template>
      <template #item.created_at="{ item }">
        <v-chip size="small" variant="outlined" class="text-caption">
          {{ date.format(item.created_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{ item.created_at }}</v-tooltip>
        </v-chip>
      </template>
      <template #item.updated_at="{ item }">
        <v-chip v-if="item.updated_at" size="small" variant="outlined" class="text-caption">
          {{ date.format(item.updated_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{ item.updated_at }}</v-tooltip>
        </v-chip>
        <v-chip v-else size="small" variant="outlined" color="grey">N/A</v-chip>
      </template>
      
      <template #no-data>
        <div class="d-flex flex-column align-center pa-4">
          <v-icon size="large" color="grey" class="mb-2">mdi-alert-circle-outline</v-icon>
          <span class="text-grey">No jobs found</span>
        </div>
      </template>

      <template #loading>
        <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
      </template>
    </v-data-table-server>

    <v-dialog
      v-if="selectedJob"
      v-model="showDialog"
      max-width="800px"
      persistent
      transition="dialog-bottom-transition"
      :retain-focus="false"
      @click:outside="closeJobDialog"
    >
      <v-card>
        <v-card-title class="d-flex justify-space-between align-center">
          <span>{{ selectedJob.title }}</span>
          <div class="d-flex gap-2">
            <v-btn
              icon
              :href="selectedJob.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon>mdi-open-in-new</v-icon>
              <v-tooltip activator="parent" location="bottom">Open in new tab</v-tooltip>
            </v-btn>
            <v-btn icon @click="closeJobDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-card-text>
          <div class="mb-4">
            <strong>Domain:</strong> {{ selectedJob.domain }}
          </div>
          <div class="mb-4">
            <strong>Created At:</strong> {{ date.format(selectedJob.created_at, 'keyboardDateTime24h') }}
          </div>
          <div class="mb-4">
            <strong>Updated At:</strong> {{ selectedJob.updated_at ? date.format(selectedJob.updated_at, 'keyboardDateTime24h') : 'N/A' }}
          </div>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <strong>Description</strong>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ selectedJob.description || 'No description available' }}
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title>
                <strong>Chat Logs</strong>
                <template #actions>
                  <v-chip size="small" class="ml-2">{{ selectedJob.chat_logs?.length || 0 }} conversations</v-chip>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <div v-if="selectedJob.chat_logs && selectedJob.chat_logs.length > 0">
                  <div v-for="(chat, index) in selectedJob.chat_logs" :key="index" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                    <div class="d-flex align-center mb-2">
                      <v-chip size="small" color="primary" class="mr-2">
                        {{ date.format(chat.start_datetime, 'keyboardDateTime24h') }}
                      </v-chip>
                      <v-chip size="small" variant="outlined">
                        {{ chat.input_token + chat.output_token }} tokens
                      </v-chip>
                    </div>
                    <div style="padding: 8px 0;">
                      <div class="text-subtitle-2 mb-1">Input:</div>
                      <div style="white-space: pre-wrap; word-break: break-word;">{{ chat.input }}</div>
                    </div>
                    <div style="padding: 8px 0;">
                      <div class="text-subtitle-2 mb-1">Output:</div>
                      <div style="white-space: pre-wrap; word-break: break-word;">{{ chat.output }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4 text-grey">
                  <v-icon size="large" class="mb-2">mdi-chat-outline</v-icon>
                  <div>No chat logs available</div>
                </div>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
