import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const endpoint = "https://localhost:8080"
const app = createApp(App);
app.provide('endpoint', endpoint)

app.use(createPinia());
app.use(router);

app.mount("#app");
