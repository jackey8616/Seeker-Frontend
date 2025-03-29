<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'

const props = defineProps<{ conversation_log_id: string }>()
const date = useDate();
const { axios } = useApi()
const tabId = ref(-1)
const log = ref()

onMounted(async () => {
  log.value = await axios.value.get(`/conversation_logs/${props.conversation_log_id}`)
    .then(({ data }) => {
      if (data.data.log == null) {return null}

      const return_data = {...data.data.log}
      for (let chat of return_data.chats) {
        const data = chat.input.substring(17, chat.input.length - 17 - 1)
        chat["json_input"] = JSON.parse(data)
      }
      return return_data
    });
})

function systemInstruction(log: { system_instruction: string[]; }) {
  return log.system_instruction.join("\n")
}
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
          >Job {{ idx + 1 }}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tabId" class="flex-grow-1">
          <v-tabs-window-item value="-1">
            <v-textarea
              readonly
              label="System Instruction"
              :model-value="systemInstruction(log)"
              rows="40"
            />
          </v-tabs-window-item>
          <v-tabs-window-item v-for="(chat, idx) in log.chats" :value="idx">
            <div style="overflow-y: auto; height: 100%;">
              <v-text-field
                readonly
                label="Title"
                :model-value="chat.json_input.title"
                variant="underlined"
              >
                  <template v-slot:append>
                  <v-btn >
                    <a :href="chat.json_input.link" target="_blank">Link</a>
                    <v-tooltip activator="parent" location="bottom">Open job in another tab</v-tooltip>
                  </v-btn>
                  </template>
              </v-text-field>
              <v-text-field
                readonly
                label="Location"
                :model-value="chat.json_input.location"
                variant="underlined"
              />
              <v-text-field
                readonly
                label="Salary"
                :model-value="chat.json_input.salary"
                variant="underlined"
              />
              <v-text-field
                readonly
                label="WorkType"
                :model-value="chat.json_input.work_type"
                variant="underlined"
              />
              <v-textarea
                readonly
                label="Details"
                :model-value="chat.json_input.details"
                rows="10"
              />
              <v-divider />
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
                  <tr v-for="(metric, key) in chat.metrics.rouge">
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
