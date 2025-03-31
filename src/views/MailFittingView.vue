<script setup lang="ts">
import { inject, ref } from 'vue';

import type ApiClient from '@/composables/apiClient';

const apiClient = inject('apiClient') as ApiClient;
const props = defineProps<{ thread_id: string }>()

const tabId = ref(0)
const invoke_debounce = ref(false)
const restriction = ref('')
const resume = ref('')
const invoke_results = ref()

async function invoke_ai(thread_id: string) {
  invoke_debounce.value = true
  const response = await apiClient.client.post(
    `/mails/fitting_by_ai/${thread_id}`,
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
</script>

<template>
  <div>
    <label>Thread</label> <v-chip size="small">{{ props.thread_id }}</v-chip>
    <v-textarea v-model="restriction" label="Restriction" rows="5" />
    <v-textarea v-model="resume" label="Resume" rows="15" />
    <v-btn
      @click="invoke_ai(props.thread_id)"
      prepend-icon="mdi-brain"
      :disabled="invoke_debounce"
    >AI Invoke</v-btn>
    <br>
    <br>
    <hr>
    <v-card>
      <v-tooltip title="Jobs" />
      <div class="d-flex flex-row">
        <v-tabs v-model="tabId" direction="vertical">
          <v-tab
            prepend-icon="mdi-briefcase"
            v-for="(_, idx) in invoke_results"
            :value="idx"
          >Job {{ idx + 1 }}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tabId" class="flex-grow-1">
          <v-tabs-window-item v-for="(result, idx) in invoke_results" :value="idx">
            <div style="overflow-y: auto; height: 100%;">
              <v-btn >
                <a :href="result.link" target="_blank">Link</a>
                <v-tooltip activator="parent" location="bottom">Open job in another tab</v-tooltip>
              </v-btn>
              <v-textarea :value="result.response" rows="15"></v-textarea>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>
