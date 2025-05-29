import type { JLPTLevel } from "@/views/FlashcardSelector.vue";
import { defineStore } from "pinia";

export type GlobalConfigKeys = "level" | "is-shuffle"
export type ConfigKeys = "show-furigana" | "show-meaning"
export type GlobalConfig = Record<GlobalConfigKeys, boolean | JLPTLevel>
export type Config = Record<ConfigKeys, boolean>

export const useConfig = defineStore('config', {
  state: () => {
    return {
      globalConfigs: {
        "level": "n5" as JLPTLevel,
        "is-shuffle": false,
      } as GlobalConfig,
      configs: {
        "show-furigana": false,
        "show-meaning": true
      } as Config
    }
  },
  actions: {
    setGlobalConfig (key: GlobalConfigKeys, value: JLPTLevel | boolean) {
      this.globalConfigs[key] = value
      localStorage.removeItem('level')
      localStorage.setItem('saved-global-config', JSON.stringify(this.globalConfigs))
    },
    setAllGlobalConfig(configs: GlobalConfig) {
      this.globalConfigs = configs
      localStorage.setItem('saved-global-config', JSON.stringify(this.globalConfigs))
    },
    setConfig(key: ConfigKeys, value: boolean) {
      this.configs[key] = value
      localStorage.setItem('saved-config', JSON.stringify(this.configs))
    },
    setAllConfig(configs: Config) {
      this.configs = configs
      localStorage.setItem('saved-config', JSON.stringify(this.configs))
    }
  },
  getters: {
    getGlobalConfig(state) {
      return state.globalConfigs
    },
    getGlobalConfigFromLocal(state) {
      const data = localStorage.getItem(`saved-global-config`)
      if (!data) {
        localStorage.setItem('level', JSON.stringify(state.globalConfigs))
        return state.globalConfigs
      }
      state.globalConfigs = JSON.parse(data) as GlobalConfig
      return state.globalConfigs
    },
    getConfig(state) {
      return state.configs
    },
    getConfigFromLocal(state) {
      const data = localStorage.getItem(`saved-config`)
      if (!data) return state.configs
      state.configs = JSON.parse(data) as Config
      return state.configs
    }
  },
})