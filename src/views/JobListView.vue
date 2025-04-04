<script setup lang="ts">
import { ref, onMounted, inject } from 'vue';
import { useDate } from 'vuetify'
import type { ApiResponseDto, Job, JobsResponse } from '@/type';
import JobDetailDialog from '@/components/JobDetailDialog.vue';
import type ApiClient from '@/composables/apiClient';

const apiClient = inject('apiClient') as ApiClient;
const date = useDate()
const urlInput = ref('')
const isSubmitting = ref(false)
const headers = ref([
  { title: 'Action', text: 'Action', value: 'action', sortable: false, width: '60px' },
  { title: 'Domain', text: 'Domain', value: 'domain', width: '120px'},
  { title: 'Title', text: 'Title', value: 'title'},
  { title: 'CreatedAt', text: 'CreateTime', value: 'created_at', sortable: true, width: '180px'},
  { title: 'UpdatedAt', text: 'UpdateTime', value: 'updated_at', sortable: true, width: '180px'},
])

const jobs = ref<Job[]>([])
const currentPage = ref(1)
const previousToken = ref<string | null>()
const nextToken = ref<string | null>()
const isLoading = ref(true)
const totalItems = ref(100)
const showDialog = ref(false)
const selectedJob = ref<Job | null>(null)
const itemsPerPage = ref(20)

async function fetchJobs(page = 1, withLoading = true) {
  if (withLoading) { isLoading.value = true }
  const payload = page == 1 ? {} : { "page_token": page > currentPage.value ? nextToken.value : previousToken.value }
  
  try {
    const { data }: ApiResponseDto<JobsResponse> = await apiClient.client.post("/jobs", payload).then(({ data }) => data);
    jobs.value = data.jobs
    previousToken.value = data.cursor.previous_page_token
    nextToken.value = data.cursor.next_page_token
    currentPage.value = page
    
    totalItems.value = Math.max(100, jobs.value.length * 5)
  } catch (error) {
    console.error("Error fetching jobs:", error)
  } finally {
    if (withLoading) { isLoading.value = false }
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

async function handleUrlSubmit() {
  if (!urlInput.value) return;
  
  isSubmitting.value = true;
  try {
    await apiClient.client.post('/jobs/crawl', { url: urlInput.value });
    urlInput.value = '';
    fetchJobs(1, false);
  } catch (error) {
    console.error("Error submitting URL:", error);
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(async () => {
  await fetchJobs(1)
})
</script>

<template>
  <div>
    <div class="d-flex align-center gap-2 mb-4">
      <v-text-field
        v-model="urlInput"
        label="Enter URL to add a Job"
        placeholder="https://example.com"
        hide-details
        class="flex-grow-1"
        :disabled="isSubmitting"
      ></v-text-field>
      <v-btn
        color="primary"
        :loading="isSubmitting"
        :disabled="!urlInput || isSubmitting"
        @click="handleUrlSubmit"
      >
        Submit
      </v-btn>
    </div>

    <v-data-table-server
      :headers="headers"
      :items="jobs"
      :items-length="totalItems"
      :loading="isLoading"
      items-per-page="20"
      @update:options="tableUpdate"
      class="elevation-1"
      hide-default-footer
    >
      <template #item.action="{ item }">
        <div class="d-flex gap-1">
          <v-btn icon size="small" @click="openJobDialog(item)">
            <v-icon>mdi-eye</v-icon>
            <v-tooltip activator="parent" location="bottom">View Details</v-tooltip>
          </v-btn>
        </div>
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

      <template #bottom>
        <div class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-2">
            <div class="text-caption">
              {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalItems) }} of {{ totalItems }}
            </div>
            <v-divider vertical class="mx-2"></v-divider>
            <div class="text-caption">
              Page {{ currentPage }}
            </div>
          </div>
          <div class="d-flex align-center gap-1">
            <v-btn
              icon
              size="small"
              variant="text"
              :disabled="currentPage === 1"
              @click="tableUpdate({ page: currentPage - 1 })"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              :disabled="!nextToken"
              @click="tableUpdate({ page: currentPage + 1 })"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-data-table-server>

    <JobDetailDialog
      v-model="showDialog"
      :job="selectedJob"
    />
  </div>
</template>
