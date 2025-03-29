import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import { 
  mdiBrain, 
  mdiBriefcase, 
  mdiCog, 
  mdiGoogle, 
  mdiInformationOutline, 
  mdiLogout,
  mdiEye,
  mdiAlertCircleOutline,
  mdiRefresh,
  mdiChevronLeft,
  mdiChevronRight,
  mdiMagnify,
  mdiFilter,
  mdiSort,
  mdiPencil,
  mdiDelete,
  mdiPlus,
  mdiCheck,
  mdiClose,
  mdiBookOpenVariant
} from '@mdi/js'
import '@mdi/font/css/materialdesignicons.css'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

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
    aliases: {
      ...aliases,
      // Auth icons
      google: mdiGoogle,
      logout: mdiLogout,
      
      // Feature icons
      ai: mdiBrain,
      information: mdiInformationOutline,
      gear: mdiCog,
      briefcase: mdiBriefcase,
      documentation: mdiBookOpenVariant,
      
      // Action icons
      view: mdiEye,
      edit: mdiPencil,
      delete: mdiDelete,
      add: mdiPlus,
      refresh: mdiRefresh,
      search: mdiMagnify,
      filter: mdiFilter,
      sort: mdiSort,
      
      // Navigation icons
      prev: mdiChevronLeft,
      next: mdiChevronRight,
      
      // Status icons
      success: mdiCheck,
      error: mdiClose,
      warning: mdiAlertCircleOutline,
    },
    sets: {
      mdi,
    },
  },
})
const app = createApp(App);
app.provide('endpoint', endpoint)
app.component('EasyDataTable', Vue3EasyDataTable)

app.use(vuetify)
app.use(createPinia());
app.use(router);

app.mount("#app");
