<template>
  <div class="w-screen flex justify-center p-8">
    <div class="flex grow flex-col max-w-[1000px] justify-center gap-4">
      <div class="flex items-center gap-8">
        <h1 class="flex grow text-1xl">{{ material.toUpperCase() }} - Current {{ currentIndex }} of {{ cards.length }}</h1>
        <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
      </div>
      <div v-if="cards.length > 0" class="flex grow flex-col gap-4">
        <div class="mt-4 flex items-center gap-16">
          <button @click="prevCard" class="w-full max-w-12 sm:max-w-20 md:max-w-32 lg:max-w-60 flex justify-center px-4 py-2 bg-gray-800 rounded cursor-pointer touch-manipulation">
            <i class='bx bx-chevrons-left text-2xl' ></i>
          </button>
          <span class="flex-auto text-center">
            {{ currentCard.title }}
          </span>
          <button @click="nextCard" class="w-full max-w-12 sm:max-w-20 md:max-w-32 lg:max-w-60 flex justify-center flex-auto px-4 py-2 bg-gray-800 rounded cursor-pointer touch-manipulation">
            <i class='bx bx-chevrons-right text-2xl' ></i>
          </button>
        </div>
        <div class="p-4 flex flex-row flex-wrap items-start justify-center gap-2 rounded text-center border border-gray-800">
          <img v-for="image in currentCard.images" :src="image" :alt="currentCard.title" class="flex w-full max-w-[450px] object-contain rounded mb-2">
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { TestEnglishGrammarLesson } from '@/utils/generate-json';
import { storeToRefs } from 'pinia';
import { useConfig } from '@/store/config';
import shuffleArray from '@/utils/shuffle-array';

const router = useRouter();
const route = useRoute();
const material = route.params.material as string;

const config = useConfig()
const { getGlobalConfigFromLocal: globalConfigs } = storeToRefs(config)

const cards = ref<TestEnglishGrammarLesson[]>([]);
const currentIndex = ref(0);

const currentCard = computed(() => cards.value[currentIndex.value] || {});

function nextCard() {
  if (currentIndex.value < cards.value.length - 1) currentIndex.value++;
  else currentIndex.value = 0;
}

function prevCard() {
  if (currentIndex.value > 0) currentIndex.value--;
  else currentIndex.value = cards.value.length - 1;
}

function back () {
  router.push({ name: 'WordCheck', params: { material } });
}

function loadSelection (): Record<string, boolean> | undefined {
  const data = localStorage.getItem(`saved-test-english-${material}`)
  if (!data) return undefined
  return JSON.parse(data);
}

onMounted(async () => {
  const rememberedCards = loadSelection()
  const response = await fetch(`/test-english/json/${material}.json`)
  const loadCards = await response.json() as TestEnglishGrammarLesson[]
  const filteredCard = rememberedCards ? loadCards.filter(item => !rememberedCards[item.id]) : loadCards
  cards.value = globalConfigs.value['is-shuffle'] ? shuffleArray(filteredCard) : filteredCard
})
</script>
