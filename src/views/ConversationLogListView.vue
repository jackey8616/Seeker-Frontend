<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import type { ApiResponseDto, ConversationLogResponse, AiConversationLog } from '@/type';
import ConversationLogDetailDialog from '@/components/ConversationLogDetailDialog.vue'

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
const itemsPerPage = ref(20)
const options = ref({
  page: 1,
  itemsPerPage: 20,
  sortBy: [{ key: 'updated_at', order: 'desc' }],
})

// Dialog related state
const showDialog = ref(false)
const selectedLog = ref<AiConversationLog>()

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

const openDetailDialog = async (logId: string) => {
  try {
    const response = await axios.value.get<ApiResponseDto<ConversationLogResponse>>(`/conversation_logs/${logId}`)
    selectedLog.value = response.data.data.log
    showDialog.value = true
  } catch (error) {
    console.error("Error fetching conversation log detail:", error)
  }
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
      hide-default-footer
    >
      <template #item.action="{ item }">
        <v-btn icon size="x-small" @click="openDetailDialog(item._id)">
          <v-icon icon="mdi-information-outline" />
          <v-tooltip activator="parent" location="bottom">Detail</v-tooltip>
        </v-btn>
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

    <ConversationLogDetailDialog
      v-model="showDialog"
      :log="selectedLog"
    />
  </div>
</template>
