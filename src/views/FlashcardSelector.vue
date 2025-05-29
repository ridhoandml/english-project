<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
    <h1 class="text-2xl font-bold">Japanese Simple Flashcard</h1>
    <h3 class="text-lg">Choose JLPT Level</h3>
    <div class="flex gap-4">
      <label class="flex items-center gap-2">
        <input type="radio" value="n5" v-model="selectedLevel" />
        N5
      </label>
      <label class="flex items-center gap-2">
        <input type="radio" value="n4" v-model="selectedLevel" />
        N4
      </label>
    </div>

    <h3 class="text-lg">Choose a Category</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        v-for="type in types"
        :key="type.name"
        class="flex flex-col px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        @click="selectType(type.name)"
      >
        <span>{{ capitalizeAll(type.name) }}</span>
        <span>{{ type.current }} / {{ type.total }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import capitalizeAll from '@/utils/capitalize-all'

export type JLPTLevel = "n5" | "n4";
export type TypeFlashCard = "noun" | "katakana-noun" | "adverb" | "verb" | "adjective-i" | "adjective-na" | "bunpou" | "particles" | "kanji"

interface FlashCardData {
  name: TypeFlashCard
  current: number
  total: number
}

const config = useConfig()
const { getGlobalConfigFromLocal: globalConfig } = storeToRefs(config)

const list: TypeFlashCard[] = ["noun", "katakana-noun", "adverb", "verb", "adjective-i", "adjective-na", "bunpou", "particles", "kanji"]
const router = useRouter();
const selectedLevel = ref<JLPTLevel>(globalConfig.value.level as JLPTLevel)
const types = ref<FlashCardData[]>([]);

watchEffect(async () => {
  types.value = await Promise.all(
    list.map(async (item) => {
      const saved = loadSelection(selectedLevel.value, item);
      const cards = await loadCards(selectedLevel.value, item);
      return {
        name: item,
        total: cards.length || 0,
        current: saved ? Object.keys(saved).length : 0
      };
    })
  );
});

watch(selectedLevel, (v) => config.setGlobalConfig("level", v))

function selectType(type: string) {
  router.push({ name: 'WordCheck', params: { level: selectedLevel.value, type } });
}

async function loadCards (level: string, type: string) {
  const jsonPath = `/jlpt-${level}/${type}.json`;

  const res = await fetch(jsonPath)
  return await res.json() as any[]
}

function loadSelection (level: string, type: string): Record<string, boolean> | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

onMounted(() => {

})
</script>
