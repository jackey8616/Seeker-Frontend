<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { useDate } from 'vuetify'
import { useApi } from '@/composables/useApi'
import MailDetailDialog from '@/components/MailDetailDialog.vue'
import type { Mail } from '@/type';

const date = useDate()
const { axios } = useApi()

const headers = [
  { title: 'Action', key: 'action', sortable: false },
  { title: 'Sender', key: 'sender', sortable: false },
  { title: 'Title', key: 'title', sortable: false },
  { title: 'Date', key: 'date', sortable: false },
]

const mails = ref<Mail[]>([])
const nextPageToken = ref<string | null>(null)
const totalCount = ref(0)
const currentPage = ref(1)
const isLoading = ref(false)
const abortController = ref<AbortController | null>(null)
const itemsPerPage = ref(10)
const showDialog = ref(false)
const selectedMail = ref<Mail | null>(null)

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

function handlePageChange(page: number) {
  fetchMails(page)
}

function openMailDialog(mail: Mail) {
  selectedMail.value = mail
  showDialog.value = true
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
    <v-data-table-server
      :headers="headers"
      :items="mails"
      :loading="isLoading"
      :items-length="totalCount"
      :page="currentPage"
      :items-per-page="itemsPerPage"
      @update:page="handlePageChange"
      hide-default-footer
      hover
    >
      <template #item.action="{ item }">
        <div class="d-flex gap-2">
          <v-btn icon size="x-small" @click="openMailDialog(item)">
            <v-icon icon="mdi-email-open" />
            <v-tooltip activator="parent" location="bottom">View Mail</v-tooltip>
          </v-btn>
          <router-link
            v-if="item.detailMail !== undefined"
            :to="{ name: 'mail-fitting', params: { thread_id: item.detailMail.id } }"
            v-slot="{ navigate }"
            custom
          >
            <v-btn icon size="x-small" @click="navigate">
              <v-icon icon="mdi-brain" />
              <v-tooltip activator="parent" location="bottom">Fitting By AI</v-tooltip>
            </v-btn>
          </router-link>
        </div>
      </template>
      <template #item.date="{ item }">
        <v-chip size="x-small">
          {{ date.format(item.date, 'keyboardDateTime24h') }}
          <v-tooltip activator="parent" location="bottom">{{ item.date }}</v-tooltip>
        </v-chip>
      </template>
      <template #expanded-row="{ item }">
        <iframe
          v-if="item.detailMail?.extracted_data"
          :src="embedHtml(item.detailMail.extracted_data)"
          width="100%"
        ></iframe>
      </template>
      <template #bottom>
        <div class="d-flex align-center justify-space-between pa-4">
          <div class="d-flex align-center gap-2">
            <div class="text-caption">
              {{ (currentPage - 1) * itemsPerPage + 1 }}-{{ Math.min(currentPage * itemsPerPage, totalCount) }} of {{ totalCount }}
            </div>
            <v-divider vertical class="mx-2"></v-divider>
            <div class="text-caption">
              Page {{ currentPage }}
            </div>
          </div>
          <div class="d-flex align-center gap-1">
            <v-btn
              icon
              size="small"
              variant="text"
              :disabled="currentPage === 1"
              @click="handlePageChange(currentPage - 1)"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn
              icon
              size="small"
              variant="text"
              :disabled="!nextPageToken"
              @click="handlePageChange(currentPage + 1)"
            >
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </div>
        </div>
      </template>
    </v-data-table-server>

    <MailDetailDialog
      v-model="showDialog"
      :mail="selectedMail"
    />
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

.mail-content {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
</style>
