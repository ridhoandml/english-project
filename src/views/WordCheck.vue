<template>
  <div class="h-screen w-screen flex flex-col justify-start overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex flex-col self-center gap-4 p-4 sm:p-8 w-full max-w-[600px]">
        <div class="flex gap-1 sm:gap-3 flex-col sm:flex-row justify-between items-center">
          <h1 class="text-2xl font-bold">{{ paramsMaterial.toUpperCase() }}</h1>
          <span class="text-base"> ({{ savedCardsCount }} - {{ listCards?.length }})</span>
          <span class="text-base"></span>
        </div>
        <div class="flex gap-4 justify-between">
          <label>
            <input
              class="border-none outline-none"
              :value="globalConfigs['hide-image']"
              v-model="globalConfigs['hide-image']"
              type="checkbox"
              name="config-saved"
            >
            Hide Image
          </label>
          <label>
            <input
              class="border-none outline-none"
              :value="globalConfigs['is-shuffle']"
              v-model="globalConfigs['is-shuffle']"
              type="checkbox"
              name="config-saved"
            >
            Shuffle
          </label>
        </div>
        <div class="flex gap-3 justify-between">
          <button @click="router.push({ name: 'Home' })" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
          <button @click="router.push({ name: 'Flashcard' })" class="flex justify-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Start Learning
          </button>
        </div>
      </div>
      <div class="flex flex-col items-center overflow-scroll">
        <div class="max-w-[900px] grid lg:grid-cols-2 gap-2 px-4 pb-4">
          <FlashcardWord 
            v-for="card in listCards"
            :hide-image="globalConfigs['hide-image']"
            :flashcard="card"
            :saved-flashcard="savedCards"
          /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch, onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlashcardWord from '@/components/FlashcardWord.vue'
import { useConfig } from '@/store/config'
import { storeToRefs } from 'pinia'
import type { TestEnglishGrammarLesson } from '@/utils/generate-json'
import { useAuth } from '@/store/auth'
import { getSavedGrammarData, getUserConfigData, updateSavedGrammarData, updateUserConfigData } from '@/firebase/english-progress'
import { useCards } from '@/store/cards'

export type EnglishWordSaved = Record<string, boolean>

const configStore = useConfig()
const cardsStore = useCards()
const authStore = useAuth()
const { globalConfigs } = storeToRefs(configStore)
const { listCards, savedCards } = storeToRefs(cardsStore)
const { user } = storeToRefs(authStore)

const router = useRouter()
const route = useRoute()
const paramsMaterial = route.params.material as string
cardsStore.setMaterial(paramsMaterial)
const SAVED_MATERIAL_NAME = `saved-test-english-${paramsMaterial}`

const savedCardsCount = computed(() => Object.values(savedCards.value).filter(value => value).length)

watch(savedCards, async (v) => {
  localStorage.setItem(SAVED_MATERIAL_NAME, JSON.stringify(v))
  if (user.value) await updateSavedGrammarData(user.value.uid, { key: SAVED_MATERIAL_NAME, content: JSON.stringify(v) })
}, { deep: true })

watch(globalConfigs, async (v) => {
  configStore.setAllGlobalConfig(v), { deep: true }
  localStorage.setItem('saved-global-config', JSON.stringify(v))
  if (user.value) await updateUserConfigData(user.value.uid, { configs: JSON.stringify(v) })
}, { deep: true })

onBeforeMount(async () => {
  if (cardsStore.material === paramsMaterial && listCards.value.length !== 0) return

  const response = await fetch(`/test-english/json/${paramsMaterial}.json`)
  const cards = await response.json() as TestEnglishGrammarLesson[]
  cardsStore.setListCard(cards)

  try {
    if (user.value) {
      const configs = await getUserConfigData(user.value.uid)
      if (configs) configStore.setAllGlobalConfig(configs)
      const saved = await getSavedGrammarData(user.value.uid, { key: SAVED_MATERIAL_NAME })
      if (saved) cardsStore.setSavedCard(saved)
    } else {
      throw Error("User not found")
    }
  } catch (e) {
    const configs = localStorage.getItem(`saved-global-config`)
    if (configs) configStore.setAllGlobalConfig(JSON.parse(configs))
    const saved = localStorage.getItem(`saved-test-english-${paramsMaterial}`)
    if (saved) cardsStore.setSavedCard(JSON.parse(saved))
  }
})
</script>