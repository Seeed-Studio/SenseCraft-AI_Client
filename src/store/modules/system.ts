import { defineStore } from "pinia"
import { SystemThemeMode, ThemeModeAttr } from "@renderer/types/theme"
import { ELoadStatus } from "@renderer/types/defines"
import { getAppConfig } from "@renderer/api"
const store = defineStore("system", {
  state: () => {
    return {
      status: ELoadStatus.LOADING,
      themeMode: SystemThemeMode.Dark,
      visibleRightSider: true 
    }
  },
  actions: {
    setThemeMode(theme?: SystemThemeMode) {
      if (theme) this.themeMode = theme
      let $root = document.documentElement
      $root.setAttribute(ThemeModeAttr, this.themeMode)
      this.themeMode === SystemThemeMode.Dark
        ? $root.classList.add(SystemThemeMode.Dark)
        : $root.classList.remove(SystemThemeMode.Dark)
    },
    
    toggleThemeMode() {
      this.setThemeMode(
        this.themeMode === SystemThemeMode.Dark
          ? SystemThemeMode.Light
          : SystemThemeMode.Dark
      )
    },

    toggleRightSider(isVisible?: boolean) {
      if (isVisible === void 0) {
        this.visibleRightSider = !this.visibleRightSider
        return
      }
      this.visibleRightSider = isVisible
    },

    async initAppData(
      timeout: number = 2000,
      max: number = 40,
      count: number = 0
    ) {
      count++
      try {
        await getAppConfig()
        this.status = ELoadStatus.LOADED
      } catch (err) {
        if (count >= max) {
          this.status = ELoadStatus.FAILED
          return
        }
        setTimeout(() => {
          this.initAppData(timeout, max, count)
        }, timeout)
      }
    }
  }
})
export default store
