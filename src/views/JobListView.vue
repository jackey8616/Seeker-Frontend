<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'

const date = useDate()
const { axios } = useApi()
const headers = ref<Header[]>([
  { text: 'Action', value: 'action' },
  { text: 'Domain', value: 'domain'},
  { text: 'Title', value: 'title'},
  { text: 'CreateTime', value: 'created_at', sortable: true},
  { text: 'UpdateTime', value: 'updated_at', sortable: true},
])
const jobs = ref<Item[]>([])

onMounted(async () => {
  const response = await axios.value.get("/jobs")
  jobs.value = response.data.data.jobs
  console.log(jobs.value)
})
</script>

<template>
  <div>
    <EasyDataTable
      style="width: 100%;"
      :headers="headers"
      :items="jobs"
      :sort-by="'updated_at'"
      :sort-type="'desc'"
    >
      <template #item-action="{ _id }"></template>
      <template #item-domain="{ domain }"><v-chip size="x-small">{{ domain }}</v-chip></template>
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
