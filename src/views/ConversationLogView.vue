<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import type { ApiResponseDto, ConversationLogResponse, AiConversationLog } from '@/type';

const props = defineProps<{ conversation_log_id: string }>()
const date = useDate();
const { axios } = useApi()
const tabId = ref(-1)
const log = ref<AiConversationLog>()

onMounted(async () => {
  log.value = await axios.value.get<ApiResponseDto<ConversationLogResponse>>(`/conversation_logs/${props.conversation_log_id}`)
    .then(({ data }) => data.data.log);
})
</script>

<template>
  <div v-if="log">
    <v-card>
      <v-toolbar title="ConversationLog" />
      <div class="d-flex flex-row">
        <v-tabs v-model="tabId" direction="vertical">
          <v-tab value="-1" prepend-icon="mdi-cog">Setup</v-tab>
          <v-tab
            prepend-icon="mdi-briefcase"
            v-for="(_, idx) in log.chats"
            :value="idx"
          >Chat {{ idx + 1 }}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tabId" class="flex-grow-1">
          <v-tabs-window-item value="-1">
            <v-textarea
              readonly
              label="System Instruction"
              :model-value="log.system_instruction"
              rows="40"
            />
          </v-tabs-window-item>
          <v-tabs-window-item v-for="(chat, idx) in log.chats" :value="idx">
            <div style="overflow-y: auto; height: 100%;">
              <v-text-field
                readonly
                label="AI runs / ends @"
                :model-value="`${date.format(chat.start_datetime, 'keyboardDateTime24h')}  ~  ${date.format(chat.end_datetime, 'keyboardDateTime24h')}`"
                variant="underlined"
              />
              <v-text-field
                readonly
                label="Input / Output tokens"
                :model-value="`${chat.input_token}  /  ${chat.output_token}`"
                variant="underlined"
              />
              <v-textarea
                readonly
                label="AI Output"
                :model-value="chat.output"
                rows="30"
              />
              <v-table v-if="chat.metrics" density="compact">
                <thead>
                  <tr>
                    <td>Metric Name</td>
                    <td>F1 Score</td>
                    <td>Precision</td>
                    <td>Recall</td>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(metric, key) in chat.metrics['rouge']">
                    <td>{{ key }}</td>
                    <td>{{ Number(metric.f).toFixed(4) }}</td>
                    <td>{{ Number(metric.p).toFixed(4) }}</td>
                    <td>{{ Number(metric.r).toFixed(4) }}</td>
                  </tr>
                </tbody>
              </v-table>
            </div>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>
