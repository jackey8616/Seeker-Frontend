<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useApi } from '@/composables/useApi';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const { axios } = useApi()
const name = ref<string>('')

onMounted(async () => {
  const response = await axios.value.get(`/users/info/${authStore.userId}`)
  name.value = response.data.name
});
</script>

<template>
  <div>Hello <b>{{ name }}</b></div>
</template>
