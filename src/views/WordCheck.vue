<template>
  <div class="h-screen w-screen flex flex-col justify-start overflow-hidden">
    <div class="flex flex-col h-full">
      <div class="flex flex-col self-center gap-4 p-4 sm:p-8 w-full max-w-[600px]">
        <div class="flex gap-1 sm:gap-3 flex-col sm:flex-row justify-between items-center">
          <h1 class="text-2xl font-bold">{{ level.toUpperCase() }} {{ capitalizeAll(type) }}</h1>
          <span class="text-base"> ({{ savedDataCount }} - {{ flashcardData?.length }})</span>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex gap-4">
            <label v-for="key in Object.keys(configs)">
              <input
                class="border-none outline-none"
                :value="(configs as Record<string, boolean>)[key]"
                v-model="(configs as Record<string, boolean>)[key]"
                type="checkbox"
                name="config-saved"
                :id="key"
              >
              {{ key }}
            </label>
          </div>
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
        <div class="max-w-[900px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 pb-4">
          <FlashcardWord 
            v-for="flashcard in flashcardData"
            :flashcard="flashcard"
            v-model:saved-flashcard="savedData"
          /> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { JLPTLevel, TypeFlashCard } from './FlashcardSelector.vue';
import FlashcardWord from '@/components/FlashcardWord.vue';
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import capitalizeAll from '@/utils/capitalize-all'

const typeMap = {
  n5: {
    noun: { default: {} as JLPTN5NounInterface[] },
    particles: { default: {} as JLPTN5ParticlesInterface[] },
    "katakana-noun": { default: {} as JLPTN5KatakanaNounInterface[] },
    adverb: { default: {} as JLPTN5AdverbInterface[] },
    "adjective-i": { default: {} as JLPTN5AdjectiveIInterface[] },
    "adjective-na": { default: {} as JLPTN5AdjectiveNaInterface[] },
    kanji: { default: {} as JLPTN5KanjiInterface[] },
    bunpou: { default: {} as JLPTN5GrammarInterface[] },
    verb: { default: {} as JLPTN5VerbInterface[] },
  },
  n4: {
    noun: { default: {} as JLPTN4NounInterface[] },
    particles: { default: {} as JLPTN4ParticlesInterface[] },
    "katakana-noun": { default: {} as JLPTN4KatakanaNounInterface[] },
    adverb: { default: {} as JLPTN4AdverbInterface[] },
    "adjective-i": { default: {} as JLPTN4AdjectiveIInterface[] },
    "adjective-na": { default: {} as JLPTN4AdjectiveNaInterface[] },
    kanji: { default: {} as JLPTN4KanjiInterface[] },
    bunpou: { default: {} as JLPTN4GrammarInterface[] },
    verb: { default: {} as JLPTN4VerbInterface[] },
  }
} as const;

export type JapaneseWordSaved = Record<string, boolean>

const jsonFiles = import.meta.glob('/public/jlpt-*/**/*.json', { eager: true })
const config = useConfig()
const { getConfigFromLocal: configs, getGlobalConfigFromLocal: globalConfigs } = storeToRefs(config)

const router = useRouter();
const route = useRoute();
const level = route.params.level as JLPTLevel
const type = route.params.type as TypeFlashCard
const savedData = ref<JapaneseWordSaved>({})

const flashcardData = computed(() => {
  for (const [path, moduleUnknown] of Object.entries(jsonFiles)) {
    const category = path.split('/').pop()?.replace('.json', '');
    
    if (path.includes(level) && type === category) {
      const levelData = typeMap[level as keyof typeof typeMap];

      if (levelData && type in levelData) {
        const module = moduleUnknown as typeof levelData[typeof type];
        return module.default;
      }
    }
  }
  return null
});

const savedDataCount = computed(() => {
  return Object.values(savedData.value).filter(value => value).length
})

const isLoaded = loadSelection()
if (isLoaded) savedData.value = isLoaded

watch(savedData, () => saveSelection(), { deep: true })
watch(configs, (v) => config.setAllConfig(v), { deep: true })
watch(globalConfigs, (v) => config.setAllGlobalConfig(v), { deep: true })

function saveSelection () {
  localStorage.setItem(`saved-${level}-${type}`, JSON.stringify(savedData.value));
}

function loadSelection (): JapaneseWordSaved | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

function startLearning() {
  router.push({ name: 'Flashcard' });
}

function back() {
  router.push({ name: 'Home' });
}
</script>