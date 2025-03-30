<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import type { ApiResponseDto, ConversationLogResponse, AiConversationLog } from '@/type';

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

// Dialog related state
const showDialog = ref(false)
const selectedLog = ref<AiConversationLog>()
const tabId = ref(-1)

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
    tabId.value = -1
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
    </v-data-table-server>

    <!-- Detail Dialog -->
    <v-dialog v-model="showDialog" max-width="1200" persistent>
      <v-card v-if="selectedLog">
        <v-toolbar title="ConversationLog">
          <v-btn icon @click="showDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div class="d-flex flex-row">
          <v-tabs v-model="tabId" direction="vertical">
            <v-tab value="-1" prepend-icon="mdi-cog">Setup</v-tab>
            <v-tab
              prepend-icon="mdi-briefcase"
              v-for="(_, idx) in selectedLog.chats"
              :value="idx"
            >Chat {{ idx + 1 }}</v-tab>
          </v-tabs>
          <v-tabs-window v-model="tabId" class="flex-grow-1">
            <v-tabs-window-item value="-1">
              <v-textarea
                readonly
                label="System Instruction"
                :model-value="selectedLog.system_instruction"
                rows="40"
              />
            </v-tabs-window-item>
            <v-tabs-window-item v-for="(chat, idx) in selectedLog.chats" :value="idx">
              <div style="overflow-y: auto; height: 100%;">
                <v-text-field
                  readonly
                  label="AI runs / ends @"
                  :model-value="`${date.format(chat.start_datetime, 'keyboardDateTime24h')}  ~  ${date.format(chat.end_datetime, 'keyboardDateTime24h')}`"
                  variant="underlined"
                />
                <v-text-field
                  readonly
                  label="Input / Output tokens"
                  :model-value="`${chat.input_token}  /  ${chat.output_token}`"
                  variant="underlined"
                />
                <v-textarea
                  readonly
                  label="AI Output"
                  :model-value="chat.output"
                  rows="30"
                />
                <v-table v-if="chat.metrics" density="compact">
                  <thead>
                    <tr>
                      <td>Metric Name</td>
                      <td>F1 Score</td>
                      <td>Precision</td>
                      <td>Recall</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(metric, key) in chat.metrics['rouge']">
                      <td>{{ key }}</td>
                      <td>{{ Number(metric.f).toFixed(4) }}</td>
                      <td>{{ Number(metric.p).toFixed(4) }}</td>
                      <td>{{ Number(metric.r).toFixed(4) }}</td>
                    </tr>
                  </tbody>
                </v-table>
              </div>
            </v-tabs-window-item>
          </v-tabs-window>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
