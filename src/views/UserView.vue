<script setup lang="ts">
import type ApiClient from '@/composables/apiClient';
import type { ApiResponseDto, ExecutionCount, ModelQuota, UserInfo, UserInfoResponse } from '@/type';
import { inject, onMounted, ref } from 'vue';
import ConversationLogListView from './ConversationLogListView.vue';
import { useDate } from 'vuetify';

const apiClient = inject('apiClient') as ApiClient;
const date = useDate();
const userinfo = ref<UserInfo | null>(null)
const executionCount = ref<ExecutionCount | null>(null)
const remainQuota = ref<Record<string, ModelQuota[]> | null>(null)

function randomColor() {
  const r = () => Math.floor(256 * Math.random());
  return `rgb(${r()}, ${r()}, ${r()})`;
}

onMounted(async () => {
  const { data }: ApiResponseDto<UserInfoResponse> = await apiClient.client.get(`/users/info`)
    .then(({ data }) => data)
  userinfo.value = data.userinfo
  executionCount.value = data.userinfo.execution_count
  remainQuota.value = data.userinfo.execution_count.remaining_quotas
});
</script>

<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-avatar v-if="userinfo?.avatar_url">
          <v-img v-if="userinfo?.avatar_url" :src="userinfo?.avatar_url"></v-img>
        </v-avatar>
        <v-avatar v-else :color="randomColor()">
          <span class="text-h5">{{ userinfo?.name[0].toUpperCase() }}</span>
        </v-avatar>
        <div>
          <h1 class="text-3xl font-bold text-white">{{ userinfo?.name }}</h1>
          <p class="text-gray-400">Welcome back!</p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card>
          <template v-slot:title>RemainQuota: AI</template>
          <v-card-text>
            <div v-for="quota in remainQuota?.ai" :key="quota.name">
              {{ quota.name }}
              <v-progress-linear
                color="green-darken-3"
                height="8"
                :model-value="quota.remaining_amount / quota.maximum_amount * 100"
                rounded="lg"
                striped
              />
              <div class="d-flex justify-space-between py-1">
                <span class="text-green-darken-3 font-weight-medium">
                  {{ quota.remaining_amount }}
                </span>

                <span class="text-medium-emphasis"> {{ quota.maximum_amount }} total </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <template v-slot:title>All</template>
          <v-card-text>
            <div>
              <p>
                Last Execution
                {{ executionCount?.last_execution_datetime ? date.format(executionCount.last_execution_datetime, 'keyboardDateTime24h') : 'Never' }}
              </p>
            </div>
            <div>
              Total Executions
              <v-progress-linear
                color="green-darken-3"
                height="8"
                model-value="100"
                rounded="lg"
                striped
              />
              <div class="d-flex justify-space-between py-1">
                <span class="text-green-darken-3 font-weight-medium">
                  {{ executionCount?.total_count }}
                </span>

                <span class="text-medium-emphasis"> {{ executionCount?.total_count }} total </span>
              </div>
            </div>
            <div>
              Recent Activities
              <v-progress-linear
                color="green-darken-3"
                height="8"
                model-value="100"
                rounded="lg"
                striped
              />
              <div class="d-flex justify-space-between py-1">
                <span class="text-green-darken-3 font-weight-medium">
                  {{ executionCount?.total_count }}
                </span>

                <span class="text-medium-emphasis"> {{ executionCount?.nearest_execution_datetimes.length }} total </span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <ConversationLogListView />
      </v-col>
    </v-row>
  </div>
</template>
