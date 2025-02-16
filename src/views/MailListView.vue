<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { useApi } from '@/composables/useApi'

const { axios } = useApi()
const headers = ref<Header[]>([
  { text: 'Action', value: 'action' },
  { text: 'Sender', value: 'sender' },
  { text: 'Title', value: 'title' },
  { text: 'Snippet', value: 'snippet' },
  { text: 'Date', value: 'date' },
])
const mails = ref<Item[]>([])
const nextPageToken = ref<string | null>(null)

async function downloadMail(id: string): Promise<any> {
  const response = await axios.value.get(`/mails/${id}`)
  return response.data.data.mail
}

function embedHtml(rawHtml: string) {
  const blob = new Blob([rawHtml], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

onMounted(async () => {
  const response = await axios.value.get("/mails/list")
  const { data } = response.data
  mails.value = data.mail_infos
  nextPageToken.value = data.next_page_token

  mails.value.map((mail) => {
    downloadMail(mail.id).then((mail_data) => {
      mail.sender = mail_data.sender;
      mail.title = mail_data.title;
      mail.date = mail_data.date;
      mail.detailMail = mail_data;
    }).catch((err) => {
      console.error(`Download mail id ${mail.id} cause error`, err)
    })
  })
})
</script>

<template>
  <div class="mail">
    <EasyDataTable
      style="width: 100%;"
      :headers="headers"
      :items="mails"
    >
      <template #item-action="{ detailMail }">
        <router-link
          :to="{ name: 'mail-fitting', params: { thread_id: detailMail.id } }"
          v-slot="{ navigate }"
          custom
        >
          <v-btn icon size="x-small" @click="navigate">
            <v-icon icon="$ai" />
            <v-tooltip activator="parent" location="bottom">Fitting By AI</v-tooltip>
          </v-btn>
        </router-link>
      </template>
      <template #expand="{ detailMail }">
        <iframe
          v-if="detailMail.extracted_data"
          :src="embedHtml(detailMail.extracted_data)"
          width="100%"
        ></iframe>
      </template>
    </EasyDataTable>
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .mail {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
