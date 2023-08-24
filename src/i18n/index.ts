
import { createI18n } from 'vue-i18n'
import en from './en/index'
import cn from './cn/index'

const messages = {
  cn,
  en
}

const i18n = createI18n({
  globalInjection: true, 
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  legacy: false
})
export default i18n
