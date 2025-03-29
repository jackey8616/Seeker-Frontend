<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'

interface ConversationLog {
  _id: string;
  model_name: string;
  total_input_token: number;
  total_output_token: number;
  created_at: string;
  updated_at: string | null;
}

const date = useDate()
const { axios } = useApi()

const headers = [
  { title: 'Action', key: 'action', sortable: false },
  { title: 'Model', key: 'model_name', sortable: false },
  { title: 'TotalToken(Input/Output)', key: 'total_token', sortable: false },
  { title: 'CreateTime', key: 'created_at', sortable: true },
  { title: 'UpdateTime', key: 'updated_at', sortable: true },
]

const logs = ref<ConversationLog[]>([])
const loading = ref(false)
const totalItems = ref(100)
const currentPage = ref(1)
const previousToken = ref<string | null>()
const nextToken = ref<string | null>()
const options = ref({
  page: 1,
  itemsPerPage: 20,
  sortBy: [{ key: 'updated_at', order: 'desc' }],
})

onMounted(async () => {
  await loadItems(1)
})

const loadItems = async (page: number) => {
  loading.value = true
  const payload = page === 1 ? {} : { "page_token": page > currentPage.value ? nextToken.value : previousToken.value }
  
  try {
    const response = await axios.value.post("/conversation_logs", payload)
    logs.value = response.data.data.logs
    previousToken.value = response.data.data.cursor.previous_page_token
    nextToken.value = response.data.data.cursor.next_page_token
    currentPage.value = page
    
    totalItems.value = Math.max(100, logs.value.length * 5)
  } catch (error) {
    console.error("Error fetching conversation logs:", error)
  } finally {
    loading.value = false
  }
}

const tableUpdate = async (options: any) => {
  const page = options.page || 1
  await loadItems(page)
}
</script>

<template>
  <div>
    <v-data-table-server
      v-model:options="options"
      :headers="headers"
      :items="logs"
      :loading="loading"
      :items-length="totalItems"
      items-per-page="20"
      @update:options="tableUpdate"
      class="elevation-1"
    >
      <template #item.action="{ item }">
        <router-link
          :to="{ name: 'conversation-log', params: { conversation_log_id: item._id } }"
          v-slot="{ navigate }"
          custom
        >
          <v-btn icon size="x-small" @click="navigate">
            <v-icon icon="mdi-information-outline" />
            <v-tooltip activator="parent" location="bottom">Detail</v-tooltip>
          </v-btn>
        </router-link>
      </template>

      <template #item.model_name="{ item }">
        <v-chip size="x-small">{{ item.model_name }}</v-chip>
      </template>

      <template #item.total_token="{ item }">
        {{ item.total_input_token }}/{{ item.total_output_token }}
      </template>

      <template #item.created_at="{ item }">
        <v-chip size="x-small">
          {{ date.format(item.created_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{ item.created_at }}</v-tooltip>
        </v-chip>
      </template>

      <template #item.updated_at="{ item }">
        <v-chip v-if="item.updated_at !== null" size="x-small">
          {{ date.format(item.updated_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{ item.updated_at }}</v-tooltip>
        </v-chip>
        <v-chip v-else size="x-small">N/A</v-chip>
      </template>

      <template #no-data>
        <div class="d-flex flex-column align-center pa-4">
          <v-icon size="large" color="grey" class="mb-2">mdi-alert-circle-outline</v-icon>
          <span class="text-grey">No conversation logs found</span>
        </div>
      </template>

      <template #loading>
        <v-skeleton-loader type="table-row@6"></v-skeleton-loader>
      </template>
    </v-data-table-server>
  </div>
</template>
