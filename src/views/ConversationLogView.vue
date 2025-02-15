<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useApi } from '@/composables/useApi'

const props = defineProps<{ conversation_log_id: string }>()
const { axios } = useApi()
const tabId = ref(1)
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

function changeTab(idx: number) {
  tabId.value = idx
}

function tabChat() {
  return log.value.chats[tabId.value]
}
</script>

<template>
  <div v-if="log">
    <label>System Instructions</label>
    <textarea :value="systemInstruction(log)" style="width: 100%; height: 40vh;"></textarea>
    <label>Jobs</label>
    <div class="tab">
      <!-- tab標籤列 -->
      <ul class="tab-title">
        <li
          v-for="(chat, idx) in log.chats"
          :class="{ 'active': tabId == idx }"
          @click="changeTab(idx)"
        >
          <a href="javascript:;" :data-tablink="`tab-${idx}`">Job {{ idx + 1 }}</a>
        </li>
      </ul>
      <!-- tab內容 -->
      <div class="tab-inner-wrap">
        <div v-if="log.chats.length > 0" class="tab-inner">
          <a :href="tabChat().json_input.link" target="_blank">Link</a><br>
          <label>Title {{ tabChat().json_input.title }}</label><br>
          <label>Location {{ tabChat().json_input.location }}</label><br>
          <label>Salary {{ tabChat().json_input.salary }}</label><br>
          <label>WorkType {{ tabChat().json_input.work_type }}</label><br>
          <textarea :value="tabChat().json_input.details" style="width: 100%; height: 20vh;"></textarea><br>
          <br>
          <label>Started at {{ tabChat().start_datetime }}</label><br>
          <label>Ended at {{ tabChat().end_datetime }}</label><br>
          <label>Input Token {{ tabChat().input_token }}</label><br>
          <label>Output Token {{ tabChat().output_token }}</label><br>
          <textarea :value="tabChat().output" style="width: 100%; height: 40vh;"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.tab {
  padding: 20px;
}

.tab-title {
  display: flex;
}

.tab-title li {
  list-style: none;
  padding: 10px;
}

.tab-title li a {
  display: block;
  padding: 10px;
  color: #333;
  background-color: #ccc;
  text-decoration: none;
}

.tab-title li.active a {
  color: #fff;
  background-color: #0071bc;
}

.tab-inner {
  padding: 10px;
  border: 1px solid #ccc;
}

</style>