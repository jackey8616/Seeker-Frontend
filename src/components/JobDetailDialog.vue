<script setup lang="ts">
import { useDate } from 'vuetify'
import type { Job } from '@/type'

const props = defineProps<{
  modelValue: boolean
  job: Job | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const date = useDate()

function closeDialog() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog
    v-if="job"
    :model-value="modelValue"
    @update:model-value="(value) => emit('update:modelValue', value)"
    max-width="800px"
    persistent
    transition="dialog-bottom-transition"
    :retain-focus="false"
    @click:outside="closeDialog"
  >
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span>{{ job.title }}</span>
        <div class="d-flex gap-2">
          <v-btn
            icon
            :href="job.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-icon>mdi-open-in-new</v-icon>
            <v-tooltip activator="parent" location="bottom">Open in new tab</v-tooltip>
          </v-btn>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <div class="mb-4">
          <strong>Domain:</strong> {{ job.domain }}
        </div>
        <div class="mb-4">
          <strong>Created At:</strong> {{ date.format(job.created_at, 'keyboardDateTime24h') }}
        </div>
        <div class="mb-4">
          <strong>Updated At:</strong> {{ job.updated_at ? date.format(job.updated_at, 'keyboardDateTime24h') : 'N/A' }}
        </div>
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <strong>Description</strong>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              {{ job.description || 'No description available' }}
            </v-expansion-panel-text>
          </v-expansion-panel>
          <v-expansion-panel>
            <v-expansion-panel-title>
              <strong>Chat Logs</strong>
              <template #actions>
                <v-chip size="small" class="ml-2">{{ job.chat_logs?.length || 0 }} conversations</v-chip>
              </template>
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <div v-if="job.chat_logs && job.chat_logs.length > 0">
                <div v-for="(chat, index) in job.chat_logs" :key="index" style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
                  <div class="d-flex align-center mb-2">
                    <v-chip size="small" color="primary" class="mr-2">
                      {{ date.format(chat.start_datetime, 'keyboardDateTime24h') }}
                    </v-chip>
                    <v-chip size="small" variant="outlined">
                      {{ chat.input_token + chat.output_token }} tokens
                    </v-chip>
                  </div>
                  <div style="padding: 8px 0;">
                    <div class="text-subtitle-2 mb-1">Input:</div>
                    <div style="white-space: pre-wrap; word-break: break-word;">{{ chat.input }}</div>
                  </div>
                  <div style="padding: 8px 0;">
                    <div class="text-subtitle-2 mb-1">Output:</div>
                    <div style="white-space: pre-wrap; word-break: break-word;">{{ chat.output }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-4 text-grey">
                <v-icon size="large" class="mb-2">mdi-chat-outline</v-icon>
                <div>No chat logs available</div>
              </div>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>
  </v-dialog>
</template> 