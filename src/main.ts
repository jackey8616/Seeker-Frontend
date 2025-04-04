import { createApp } from "vue";
import { createPinia } from "pinia";
import { createGtm } from '@gtm-support/vue-gtm';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from "./App.vue";
import router from "./router";
import ApiClient from "./composables/apiClient";

const endpoint = import.meta.env.VITE_API_ENDPOINT;
const apiClient = new ApiClient({ baseURL: endpoint })
  .withCredentials()
  .withAutoRefresh()

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark'
  },
  icons: {
    defaultSet: 'mdi',
    sets: {
      mdi,
    },
  },
})
const app = createApp(App);
app.provide('endpoint', endpoint)
app.provide('apiClient', apiClient)

app.use(createGtm({
  id: 'GTM-K62VSLXT',
  enabled: import.meta.env.PROD,
  debug: import.meta.env.DEV,
  vueRouter: router,
}))
app.use(vuetify)
app.use(createPinia());
app.use(router);

app.mount("#app");
