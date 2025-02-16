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
      <div class="d-flex flex-row" style="height: 100vh;">
        <v-tabs v-model="tabId" direction="vertical">
          <v-tab value="-1" prepend-icon="$gear">Setup</v-tab>
          <v-tab
            prepend-icon="$briefcase"
            v-for="(_, idx) in log.chats"
            :value="idx"
          >Job {{ idx + 1}}</v-tab>
        </v-tabs>
        <v-tabs-window v-model="tabId" class="flex-grow-1">
          <v-tabs-window-item value="-1">
            <h3>System Instruction</h3>
            <v-textarea :value="systemInstruction(log)" style="width: 100%; height: 80vh;"></v-textarea>
          </v-tabs-window-item>
          <v-tabs-window-item v-for="(chat, idx) in log.chats" :value="idx">
            <v-text-field readonly :model-value="chat.json_input.title" label="Title" variant="underlined">
                <template v-slot:append>
                <v-btn >
                  <a :href="chat.json_input.link" target="_blank">Link</a>
                  <v-tooltip activator="parent" location="bottom">Open job in another tab</v-tooltip>
                </v-btn>
                </template>
            </v-text-field>
            <v-text-field readonly :model-value="chat.json_input.location" label="Location" variant="underlined" />
            <v-text-field readonly :model-value="chat.json_input.salary" label="Salary" variant="underlined" />
            <v-text-field readonly :model-value="chat.json_input.work_type" label="WorkType" variant="underlined" />
            <v-textarea readonly :model-value="chat.json_input.details" label="Details" style="width: 100%; height: 20vh;" />
            <br>
            <v-text-field
              readonly
              :model-value="`${date.format(chat.start_datetime, 'keyboardDateTime24h')}  ~  ${date.format(chat.end_datetime, 'keyboardDateTime24h')}`"
              label="AI runs / ends @"
              variant="underlined" />
            <v-text-field
              readonly
              :model-value="`${chat.input_token}  /  ${chat.output_token}`"
              label="Input / Output tokens"
              variant="underlined" />
            <v-textarea readonly :model-value="chat.output" label="AI Output" style="width: 100%; height: 40vh;"></v-textarea>
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </div>
</template>
