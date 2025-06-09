<template>
  <label
    :id="flashcard.id"
    class="w-max-[500px] sm:w-[500px] lg:w-[400px] relative flex flex-col gap-1 p-2 border border-slate-800 rounded">
    <input
      class="absolute top-3 right-2 border-none outline-none"
      :value="savedFlashcard[flashcard.id]"
      v-model="savedFlashcard[flashcard.id]"
      type="checkbox"
      name="saved"
      :id="flashcard.id"
    >
    <span class="text-xl">{{ flashcard.title }}</span>
    <div v-if="!hideImage" v-for="image in flashcard.images" :key="image" class="flex items-center justify-center">
      <img :src="image" :alt="flashcard.title" loading="lazy" />
    </div>
  </label>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { TestEnglishGrammarLesson } from '@/utils/generate-json';
import type { EnglishWordSaved } from '@/views/WordCheck.vue';

withDefaults(defineProps<{
  hideImage: boolean
  flashcard: TestEnglishGrammarLesson
  savedFlashcard: EnglishWordSaved
}>(), {
  hideImage: false
})
</script>
