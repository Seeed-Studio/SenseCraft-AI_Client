import { createApp } from "vue"
import { createPinia } from "pinia"
import { createPersistedState } from "pinia-plugin-persistedstate"
import "tdesign-vue-next/es/style/index.css"
import "@renderer/assets/style/index.css"
import App from "./App.vue"
import router from "./router"
import i18n from "./i18n"

const pinia = createPinia()
pinia.use(
  createPersistedState({ key: (stateName) => `__JETSON__${stateName}` })
)

const app = createApp(App)
app.use(pinia).use(i18n).use(router).mount("#app")
