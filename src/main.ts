import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

import App from "./App.vue";
import router from "./router";


const endpoint = "https://seeker-backend.clo5de.info"
// const endpoint = "https://localhost:8090"

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

app.use(vuetify)
app.use(createPinia());
app.use(router);

app.mount("#app");
