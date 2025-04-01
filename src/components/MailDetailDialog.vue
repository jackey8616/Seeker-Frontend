<script setup lang="ts">
import { useDate } from 'vuetify'
import { inject } from 'vue'
import ApiClient from '@/composables/apiClient'

const apiClient = inject('apiClient') as ApiClient;
const date = useDate()

interface Mail {
  id: string;
  sender: string;
  title: string;
  date: string;
  detailMail?: any;
  extracted_data?: string;
  read?: boolean;
}

const props = defineProps<{
  modelValue: boolean;
  mail: Mail | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:read', value: boolean): void;
}>();

async function markAsRead() {
  if (!props.mail?.detailMail?.id) return;
  
  try {
    await apiClient.client.post(`/mails/${props.mail.detailMail.id}/read`);
    emit('update:read', true);
  } catch (error) {
    console.error('Error marking mail as read:', error);
  }
}

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
        <div class="d-flex gap-2">
          <v-btn icon @click="markAsRead">
            <v-icon>mdi-email-outline</v-icon>
            <v-tooltip activator="parent" location="bottom">Mark as read</v-tooltip>
          </v-btn>
          <router-link
            v-if="mail?.detailMail"
            :to="{ name: 'mail-fitting', params: { thread_id: mail.detailMail.id } }"
            v-slot="{ navigate }"
            custom
          >
            <v-btn icon @click="navigate">
              <v-icon icon="mdi-brain" />
              <v-tooltip activator="parent" location="bottom">Fitting By AI</v-tooltip>
            </v-btn>
          </router-link>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="mb-4">
          <strong>From:</strong> {{ mail?.sender }}
        </div>
        <div class="mb-4">
          <strong>Date:</strong> {{ date.format(mail?.date, 'keyboardDateTime24h') }}
        </div>
        <v-expansion-panels v-if="mail?.detailMail?.extracted_data">
          <v-expansion-panel>
            <v-expansion-panel-title>
              Mail Content
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div class="mail-content">
                <iframe
                  :src="embedHtml(mail.detailMail.extracted_data)"
                  width="100%"
                  height="500px"
                  frameborder="0"
                ></iframe>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
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