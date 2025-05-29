<template>
  <label
    :id="flashcard.main"
    class="w-44 sm:w-44 h-28 relative flex flex-col gap-1 p-2 border border-slate-800 rounded">
    <input
      class="absolute top-2 right-2 border-none outline-none"
      :value="savedFlashcard[flashcard.main]"
      v-model="savedFlashcard[flashcard.main]"
      type="checkbox"
      name="saved"
      :id="flashcard.main"
    >
    <div class="flex gap-3 items-center">
      <span class="text-xl">{{ flashcard.main }}</span>
      <span v-if="configs['show-furigana'] && 'kana' in flashcard" class="text-xs text-gray-300">{{ flashcard.kana }}</span>
    </div>
    <span v-if="configs['show-meaning']" class="text-sm text-gray-100 line-clamp-3">{{ flashcard.meaning }}</span>
  </label>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import type { JapaneseWordSaved } from '@/views/WordCheck.vue';

const config = useConfig()
const { getConfigFromLocal: configs } = storeToRefs(config)

type JLPTN5 = JLPTN5NounInterface | JLPTN5ParticlesInterface | JLPTN5KatakanaNounInterface | JLPTN5AdjectiveIInterface | JLPTN5AdverbInterface | JLPTN5AdjectiveNaInterface | JLPTN5KanjiInterface | JLPTN5GrammarInterface | JLPTN5VerbInterface

type JLPTN4 = JLPTN4NounInterface | JLPTN4ParticlesInterface | JLPTN4KatakanaNounInterface | JLPTN4AdjectiveIInterface | JLPTN4AdverbInterface | JLPTN4AdjectiveNaInterface | JLPTN4KanjiInterface | JLPTN4GrammarInterface | JLPTN4VerbInterface

type JLPT = JLPTN5 | JLPTN4

defineProps<{
  flashcard: JLPT
  savedFlashcard: JapaneseWordSaved
}>()
</script>
