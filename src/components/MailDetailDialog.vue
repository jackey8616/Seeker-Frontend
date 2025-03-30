<script setup lang="ts">
import { useDate } from 'vuetify'

const date = useDate()

interface Mail {
  id: string;
  sender: string;
  title: string;
  date: string;
  detailMail?: any;
  extracted_data?: string;
}

const props = defineProps<{
  modelValue: boolean;
  mail: Mail | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

function embedHtml(rawHtml: string) {
  const blob = new Blob([rawHtml], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

function closeDialog() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
    max-width="800px"
    persistent
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ mail?.title }}</span>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div class="mb-4">
          <strong>From:</strong> {{ mail?.sender }}
        </div>
        <div class="mb-4">
          <strong>Date:</strong> {{ date.format(mail?.date, 'keyboardDateTime24h') }}
        </div>
        <div v-if="mail?.detailMail?.extracted_data" class="mail-content">
          <iframe
            :src="embedHtml(mail.detailMail.extracted_data)"
            width="100%"
            height="500px"
            frameborder="0"
          ></iframe>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.mail-content {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style> 