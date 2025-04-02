<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDate } from 'vuetify'
import type { AiConversationLog } from '@/type'
import ChatLogDetail from './ChatLogDetail.vue';

const props = defineProps<{
  modelValue: boolean
  log: AiConversationLog | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const date = useDate()
const tabId = ref(-1)

const showDialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})
</script>

<template>
  <v-dialog v-model="showDialog" max-width="1200" persistent>
    <v-card v-if="log">
      <v-toolbar title="ConversationLog">
        <v-btn icon @click="showDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
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
            <ChatLogDetail :chat="chat" />
          </v-tabs-window-item>
        </v-tabs-window>
      </div>
    </v-card>
  </v-dialog>
</template> 