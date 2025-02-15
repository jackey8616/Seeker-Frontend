<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';

import { useApi } from '@/composables/useApi'

const { axios } = useApi()
const headers = ref<Header[]>([
  { text: 'Detail', value: 'detail' },
  { text: 'Model', value: 'model_name'},
  { text: 'TotalInputToken', value: 'total_input_token'},
  { text: 'TotalOutputToken', value: 'total_output_token'},
  { text: 'CreateTime', value: 'created_at'},
  { text: 'UpdateTime', value: 'updated_at'},
])
const logs = ref<Item[]>([])

onMounted(async () => {
  const response = await axios.value.get("/conversation_logs")
  logs.value = response.data.data.logs
})
</script>

<template>
  <div>
    <EasyDataTable
      style="width: 100%;"
      :headers="headers"
      :items="logs"
    >
      <template #item-detail="{ _id }">
        <router-link
          :to="{ name: 'conversation-log', params: { conversation_log_id: _id } }"
          v-slot="{ navigate }"
          custom
        >
          <button @click="navigate">Detail</button>
        </router-link>
      </template>
    </EasyDataTable>
  </div>
</template>
