<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import { useRouter } from 'vue-router'

interface Job {
  _id: string;
  title: string;
  domain: string;
  description?: string;
  created_at: string;
  updated_at: string | null;
  metadata?: Record<string, any>;
}

// Additional interface for Vuetify data table items
interface DataTableItem {
  columns: Record<string, any>;
  item: {
    raw: Job;
    value: unknown;
  };
  internalItem: Job;
}

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

async function fetchJobs(page = 1) {
  isLoading.value = true
  const payload = page == 1 ? {} : { "page_token": page > currentPage.value ? nextToken.value : previousToken.value }
  
  try {
    const { data } = await axios.value.post("/jobs", payload)
    jobs.value = data.data.jobs
    previousToken.value = data.data.cursor.previous_page_token
    nextToken.value = data.data.cursor.next_page_token
    currentPage.value = page
    
    totalItems.value = Math.max(100, jobs.value.length * 5)
  } catch (error) {
    console.error("Error fetching jobs:", error)
  } finally {
    isLoading.value = false
  }
}

async function tableUpdate(options: any) {
  console.log("Options updated:", options)
  const page = options.page || 1
  await fetchJobs(page)
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
      <!-- <template #item.action="{ item }">
        <router-link
          :to="{ name: 'job', params: { job_id: item._id } }"
          v-slot="{ navigate }"
          custom
        >
          <v-btn icon size="small" @click="navigate">
            <v-icon>mdi-eye</v-icon>
            <v-tooltip activator="parent" location="bottom">View Details</v-tooltip>
          </v-btn>
        </router-link>
      </template> -->
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
  </div>
</template>
