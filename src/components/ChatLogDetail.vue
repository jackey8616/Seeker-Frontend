<script setup lang="ts">
import type { AiChatLog } from '@/type';
import { useDate } from 'vuetify';

const date = useDate()

const props = defineProps<{
    chat: AiChatLog
}>();
</script>

<template>
  <div class="d-flex align-center mb-2">
    <v-chip size="small" color="primary" class="mr-2">
      {{ date.format(chat.start_datetime, 'keyboardDateTime24h') }}
    </v-chip>
    <v-chip size="small" variant="outlined">
      {{ chat.input_token + chat.output_token }} tokens
      <v-tooltip activator="parent" location="bottom">
        <div>
          <div>Input Token: {{ chat.input_token }}</div>
          <div>Output Token: {{ chat.output_token }}</div>
        </div>
      </v-tooltip>
    </v-chip>
  </div>
  <div style="padding: 8px 0;">
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>Input</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div style="white-space: pre-wrap; word-break: break-word;">{{ props.chat.input }}</div>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-title>Output</v-expansion-panel-title>
        <v-expansion-panel-text>
          <div style="white-space: pre-wrap; word-break: break-word;">{{ props.chat.output }}</div>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel>
        <v-expansion-panel-title>Metric</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-table v-if="props.chat.metrics" density="compact">
            <thead>
              <tr>
                <td>Metric Name</td>
                <td>F1 Score</td>
                <td>Precision</td>
                <td>Recall</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(metric, key) in props.chat.metrics['rouge']">
                <td>{{ key }}</td>
                <td>{{ Number(metric.f).toFixed(4) }}</td>
                <td>{{ Number(metric.p).toFixed(4) }}</td>
                <td>{{ Number(metric.r).toFixed(4) }}</td>
              </tr>
            </tbody>
          </v-table>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>