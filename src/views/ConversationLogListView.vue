<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'

const date = useDate()
const { axios } = useApi()
const headers = ref<Header[]>([
  { text: 'Action', value: 'action' },
  { text: 'Model', value: 'model_name'},
  { text: 'TotalToken(Input/Output)', value: 'total_token'},
  { text: 'CreateTime', value: 'created_at', sortable: true},
  { text: 'UpdateTime', value: 'updated_at', sortable: true},
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
      :sort-by="'updated_at'"
      :sort-type="'desc'"
    >
      <template #item-action="{ _id }">
        <router-link
          :to="{ name: 'conversation-log', params: { conversation_log_id: _id } }"
          v-slot="{ navigate }"
          custom
        >
          <v-btn icon size="x-small" @click="navigate">
            <v-icon icon="$information" />
            <v-tooltip activator="parent" location="bottom">Detail</v-tooltip>
          </v-btn>
        </router-link>
      </template>
      <template #item-model_name="{ model_name }"><v-chip size="x-small">{{ model_name }}</v-chip></template>
      <template #item-total_token="{ total_input_token, total_output_token }">
        {{ total_input_token }}/{{ total_output_token }}
      </template>
      <template #item-created_at="{ created_at }">
        <v-chip size="x-small">
          {{  date.format(created_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{  created_at  }}</v-tooltip>
        </v-chip>
      </template>
      <template #item-updated_at="{ updated_at }">
        <v-chip v-if="updated_at !== null" size="x-small">
          {{  date.format(updated_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{  updated_at  }}</v-tooltip>
        </v-chip>
        <v-chip v-else size="x-small">N/A</v-chip>
      </template>
    </EasyDataTable>
  </div>
</template>
