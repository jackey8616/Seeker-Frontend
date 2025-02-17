<script setup lang="ts">
import { ref } from 'vue';

import { useApi } from '@/composables/useApi';

const props = defineProps<{ thread_id: string }>()
const { axios } = useApi()
const invoke_debounce = ref(false)
const restriction = ref('')
const resume = ref('')
const invoke_results = ref()

async function invoke_ai(thread_id: string) {
  invoke_debounce.value = true
  const response = await axios.value.post(
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
      prepend-icon="$ai"
      :disabled="invoke_debounce"
    >AI Invoke</v-btn>
    <br>
    <br>
    <hr>
    <div v-for="result in invoke_results" v-bind:key="result.link">
      <label>Link</label><a :href="result.link">{{ result.link }}</a><br>
      <label>Fitting</label>
      <v-textarea :value="result.response" style="width: 100%; height: 15vh;"></v-textarea>
    </div>
  </div>
</template>
