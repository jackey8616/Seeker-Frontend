import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';


const endpoint = "https://seeker-backend.clo5de.info"
// const endpoint = "https://localhost:8090"
const app = createApp(App);
app.provide('endpoint', endpoint)
app.component('EasyDataTable', Vue3EasyDataTable);

app.use(createPinia());
app.use(router);

app.mount("#app");
