import { defineStore } from "pinia";

export type GlobalConfigKeys = "material" | "is-shuffle"
export type GlobalConfig = Record<GlobalConfigKeys, boolean | string>

export const useConfig = defineStore('config', {
  state: () => {
    return {
      globalConfigs: {
        "material": "",
        "is-shuffle": false,
      } as GlobalConfig,
    }
  },
  actions: {
    setGlobalConfig (key: GlobalConfigKeys, value: string | boolean) {
      this.globalConfigs[key] = value
      localStorage.removeItem('material')
      localStorage.setItem('saved-global-config', JSON.stringify(this.globalConfigs))
    },
    setAllGlobalConfig(configs: GlobalConfig) {
      this.globalConfigs = configs
      localStorage.setItem('saved-global-config', JSON.stringify(this.globalConfigs))
    }
  },
  getters: {
    getGlobalConfig(state) {
      return state.globalConfigs
    },
    getGlobalConfigFromLocal(state) {
      const data = localStorage.getItem(`saved-global-config`)
      if (!data) {
        localStorage.setItem('material', JSON.stringify(state.globalConfigs))
        return state.globalConfigs
      }
      state.globalConfigs = JSON.parse(data) as GlobalConfig
      return state.globalConfigs
    },
  },
})