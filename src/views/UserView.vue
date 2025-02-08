<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useApi } from '@/composables/useApi';

const { axios } = useApi()
const name = ref<string>('')

onMounted(async () => {
  const response = await axios.value.get(`/users/info`)
  name.value = response.data.name
});
</script>

<template>
  <div>Hello <b>{{ name }}</b></div>
</template>
