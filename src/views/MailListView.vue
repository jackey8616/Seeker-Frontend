<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Header, Item } from 'vue3-easy-data-table';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'

const date = useDate()
const { axios } = useApi()
const headers = ref<Header[]>([
  { text: 'Action', value: 'action' },
  { text: 'Sender', value: 'sender' },
  { text: 'Title', value: 'title' },
  { text: 'Date', value: 'date' },
])
const mails = ref<Item[]>([])
const nextPageToken = ref<string | null>(null)
const abortController = ref<AbortController | null>(null)

async function downloadMail(id: string): Promise<any> {
  try {
    const response = await axios.value.get(`/mails/${id}`, {
      signal: abortController.value?.signal
    })
    return response.data.data.mail
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('Request was aborted')
      return null
    }
    throw error
  }
}

function embedHtml(rawHtml: string) {
  const blob = new Blob([rawHtml], { type: 'text/html' })
  return URL.createObjectURL(blob)
}

onMounted(async () => {
  abortController.value = new AbortController()
  
  try {
    const response = await axios.value.get("/mails/list", {
      signal: abortController.value.signal
    })
    const { data } = response.data
    mails.value = data.mail_infos
    nextPageToken.value = data.next_page_token

    const downloadPromises = mails.value.map((mail) => {
      return downloadMail(mail.id)
        .then((mail_data) => {
          if (mail_data) {
            mail.sender = mail_data.sender;
            mail.title = mail_data.title;
            mail.date = mail_data.date;
            mail.detailMail = mail_data;
          }
        })
        .catch((err) => {
          console.error(`Download mail id ${mail.id} cause error`, err)
        })
    })

    await Promise.all(downloadPromises)
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('List request was aborted')
      return
    }
    console.error('Error fetching mail list:', error)
  }
})

onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort()
  }
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
          v-if="detailMail !== undefined"
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
      <template #item-date="{ date: created_at }">
        <v-chip size="x-small">
          {{  date.format(created_at, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{  created_at  }}</v-tooltip>
        </v-chip>
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
