import type { TestEnglishGrammarLesson } from "@/utils/generate-json"
import type { EnglishWordSaved } from "@/views/WordCheck.vue"
import { defineStore } from "pinia"

export const useCards = defineStore('cards', {
  state: () => {
    return {
      material: "",
      listCards: [] as TestEnglishGrammarLesson[],
      savedCards: {} as EnglishWordSaved,
    }
  },
  actions: {
    setMaterial (material: string) {
      this.material = material
    },
    setListCard(cards: TestEnglishGrammarLesson[]) {
      this.listCards = cards
    },
    setSavedCard(cards: EnglishWordSaved) {
      this.savedCards = cards
    }
  },
})