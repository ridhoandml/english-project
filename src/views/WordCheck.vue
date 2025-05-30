<template>
  <div class="h-screen w-screen flex flex-col justify-start overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex flex-col self-center gap-4 p-4 sm:p-8 w-full max-w-[600px]">
        <div class="flex gap-1 sm:gap-3 flex-col sm:flex-row justify-between items-center">
          <h1 class="text-2xl font-bold">{{ material.toUpperCase() }}</h1>
          <span class="text-base"> ({{ savedDataCount }} - {{ flashcardData?.length }})</span>
          <span class="text-base"></span>
        </div>
        <div class="flex gap-4 justify-between">
          <label>
            <input
              class="border-none outline-none"
              :value="globalConfigs['is-shuffle']"
              v-model="globalConfigs['is-shuffle']"
              type="checkbox"
              name="config-saved"
            >
            shuffle
          </label>
        </div>
        <div class="flex gap-3 justify-between">
          <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
          <button @click="startLearning" class="flex justify-center px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
            Start Learning
          </button>
        </div>
      </div>
      <div class="flex flex-col items-center overflow-scroll">
        <div class="max-w-[900px] grid lg:grid-cols-2 gap-2 px-4 pb-4">
          <FlashcardWord 
            v-for="flashcard in flashcardData"
            :flashcard="flashcard"
            :saved-flashcard="savedData"
          /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FlashcardWord from '@/components/FlashcardWord.vue';
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import type { TestEnglishGrammarLesson } from '@/utils/generate-json';

export type EnglishWordSaved = Record<string, boolean>
const config = useConfig()
const { getGlobalConfigFromLocal: globalConfigs } = storeToRefs(config)

const router = useRouter();
const route = useRoute();
const material = route.params.material as string
const flashcardData = ref<TestEnglishGrammarLesson[]>([])
const savedData = ref<EnglishWordSaved>({})

const savedDataCount = computed(() => {
  return Object.values(savedData.value).filter(value => value).length
})

watch(savedData, () => localStorage.setItem(`saved-test-english-${material}`, JSON.stringify(savedData.value)), { deep: true })
watch(globalConfigs, (v) => config.setAllGlobalConfig(v), { deep: true })

function loadSelection (): EnglishWordSaved | undefined {
  const data = localStorage.getItem(`saved-test-english-${material}`)
  if (!data) return undefined
  return JSON.parse(data);
}

const isLoaded = loadSelection()
if (isLoaded) savedData.value = isLoaded

function startLearning() {
  router.push({ name: 'Flashcard' });
}

function back() {
  router.push({ name: 'Home' });
}

onMounted(async () => {
  const response = await fetch(`/test-english/json/${material}.json`)
  flashcardData.value = await response.json() as TestEnglishGrammarLesson[]
})
</script>