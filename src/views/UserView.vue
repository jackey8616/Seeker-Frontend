<script setup lang="ts">
import type ApiClient from '@/composables/apiClient';
import { inject, onMounted, ref } from 'vue';


const apiClient = inject('apiClient') as ApiClient;
const name = ref<string>('')

onMounted(async () => {
  const response = await apiClient.client.get(`/users/info`)
  name.value = response.data.name
});
</script>

<template>
  <div>Hello <b>{{ name }}</b></div>
</template>
