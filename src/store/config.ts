import { defineStore } from "pinia"

export type GlobalConfigKeys = "hide-image" | "is-shuffle"
export type GlobalConfig = Record<GlobalConfigKeys, boolean>

export const useConfig = defineStore('config', {
  state: () => {
    return {
      globalConfigs: {
        "hide-image": false,
        "is-shuffle": false,
      } as GlobalConfig,
    }
  },
  actions: {
    setGlobalConfig (key: GlobalConfigKeys, value: boolean) {
      this.globalConfigs[key] = value
    },
    setAllGlobalConfig(configs: GlobalConfig) {
      this.globalConfigs = configs
    }
  },
})