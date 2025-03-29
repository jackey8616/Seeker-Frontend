<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import type { Header, Item, ServerOptions } from 'vue3-easy-data-table';
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
const totalCount = ref(0)
const currentPage = ref(1)
const isLoading = ref(false)
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

async function fetchMails(page = 1) {
  isLoading.value = true
  
  try {
    const payload = page === 1 ? {} : { next_page_token: nextPageToken.value }
    const response = await axios.value.post("/mails/list", payload, {
      signal: abortController.value?.signal
    })
    const { data } = response.data
    mails.value = data.mail_infos
    nextPageToken.value = data.next_page_token
    totalCount.value = data.total_count
    currentPage.value = page

    if (!abortController.value?.signal.aborted) {
      const downloadPromises = mails.value.map((mail) => {
        return downloadMail(mail.id)
          .then((mail_data) => {
            if (mail_data && !abortController.value?.signal.aborted) {
              mail.sender = mail_data.sender;
              mail.title = mail_data.title;
              mail.date = mail_data.date;
              mail.detailMail = mail_data;
            }
          })
          .catch((err) => {
            if (err.name !== 'AbortError') {
              console.error(`Download mail id ${mail.id} cause error`, err)
            }
          })
      })

      await Promise.all(downloadPromises)
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log('List request was aborted')
      return
    }
    console.error('Error fetching mail list:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  abortController.value = new AbortController()
  fetchMails()
})

onUnmounted(() => {
  if (abortController.value) {
    abortController.value.abort()
    abortController.value = null
  }
})
</script>

<template>
  <div class="mail">
    <EasyDataTable
      style="width: 100%;"
      :headers="headers"
      :items="mails"
      :loading="isLoading"
      :server-items-length="totalCount"
      :server-options="{ page: currentPage, rowsPerPage: 10 }"
      @update:server-options="(options: ServerOptions) => fetchMails(options.page)"
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
