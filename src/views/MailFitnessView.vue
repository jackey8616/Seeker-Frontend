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
    `/mails/fitness_by_ai/${thread_id}`,
    {
      restriction: restriction.value,
      resume: resume.value,
    },
  )
  invoke_debounce.value = false
  invoke_results.value = response.data.result
}
</script>

<template>
  <div>
    <label>Thread</label> {{ props.thread_id }}<br>
    <input v-model="restriction" placeholder="Restriction"/><br>
    <textarea v-model="resume" placeholder="Resume" style="width: 100%; height: 20vh;"></textarea><br>
    <button @click="invoke_ai(props.thread_id)" :disabled="invoke_debounce">AI Invoke</button>
    <br>
    <br>
    <hr>
    <div v-for="result in invoke_results" v-bind:key="result.link">
      <label>Link</label><a :href="result.link">{{ result.link }}</a><br>
      <label>Fitness</label>
      <textarea :value="result.response" style="width: 100%; height: 15vh;"></textarea>
    </div>
  </div>
</template>
