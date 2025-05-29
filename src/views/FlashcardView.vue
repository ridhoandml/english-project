<template>
  <div class="h-screen w-screen flex items-center justify-center p-8">
    <div class="flex grow flex-col max-w-[400px] justify-center gap-4">
      <div class="flex items-center gap-8">
        <h1 class="flex grow text-1xl">{{ level.toUpperCase() }} {{ type }} - Current {{ currentIndex }} of {{ cards.length }}</h1>
        <button @click="back" class="px-4 py-2 bg-gray-800 rounded cursor-pointer">Back</button>
      </div>
      <div v-if="cards.length > 0" class="flex grow flex-col">
        <div class="p-4 flex flex-col gap-2 rounded h-64 text-center border border-gray-800">
          <div
            v-if="'kana' in currentCard"
            class="text-2xl text-gray-300"
            :class="showDetails ? 'invisible' : 'visible'"
            >
            {{ currentCard.kana }}
          </div>
          <div class="text-5xl">{{ currentCard.main }}</div>
          <div class="text-2xl text-gray-100">{{ currentCard.meaning }}</div>
        </div>
  
        <div class="mt-4 flex gap-2">
          <button @click="prevCard" class="flex justify-center flex-auto px-4 py-2 bg-gray-800 rounded cursor-pointer touch-manipulation">
            <i class='bx bx-chevrons-left text-2xl' ></i>
          </button>
          <div class="flex grow gap-2">
            <button @click="speak" class="flex justify-center flex-auto px-4 py-2 bg-green-500 text-white rounded cursor-pointer">
              <i class='bx bxs-user-voice text-2xl' ></i>
            </button>
            <button @click="toggleDetails" class="flex justify-center flex-auto px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
              <div v-if="showDetails" class="flex items-center justify-center">
                <i class=' bx bx-hide text-2xl'></i>
              </div>
              <div v-else class="flex items-center justify-center">
                <i class='bx bx-show text-2xl'></i>
              </div>
            </button>
          </div>
          <button @click="nextCard" class="flex justify-center flex-auto px-4 py-2 bg-gray-800 rounded cursor-pointer touch-manipulation">
            <i class='bx bx-chevrons-right text-2xl' ></i>
          </button>
        </div>
      </div>
      <div v-else>Loading...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { JLPTLevel, TypeFlashCard } from './FlashcardSelector.vue';
import { useConfig } from '@/store/config';
import { storeToRefs } from 'pinia';
import shuffleArray from '@/utils/shuffle-array';

type JLPTN5 = JLPTN5NounInterface | JLPTN5ParticlesInterface | JLPTN5KatakanaNounInterface | JLPTN5AdjectiveIInterface | JLPTN5AdverbInterface | JLPTN5AdjectiveNaInterface | JLPTN5KanjiInterface | JLPTN5GrammarInterface | JLPTN5VerbInterface

type JLPTN4 = JLPTN4NounInterface | JLPTN4ParticlesInterface | JLPTN4KatakanaNounInterface | JLPTN4AdjectiveIInterface | JLPTN4AdverbInterface | JLPTN4AdjectiveNaInterface | JLPTN4KanjiInterface | JLPTN4GrammarInterface | JLPTN4VerbInterface

type JLPT = JLPTN5 | JLPTN4

const router = useRouter();
const route = useRoute();
const level = route.params.level as JLPTLevel;
const type = route.params.type as TypeFlashCard;

const config = useConfig()
const { getGlobalConfigFromLocal: globalConfig } = storeToRefs(config)

const jsonPath = `/jlpt-${level}/${type}.json`;

const cards = ref<JLPT[]>([]);
const currentIndex = ref(0);
const showDetails = ref(false);

const currentCard = computed(() => cards.value[currentIndex.value] || {});

async function loadCards() {
  const res = await fetch(jsonPath)
  const rememberedCards = loadSelection()
  const json = await res.json() as JLPT[]
  const filteredCard = rememberedCards ? json.filter(item => !rememberedCards[item.main]) : json
  cards.value = globalConfig.value['is-shuffle'] ? shuffleArray(filteredCard) : filteredCard
}

function nextCard() {
  if (currentIndex.value < cards.value.length - 1) currentIndex.value++;
  else currentIndex.value = 0;
}

function prevCard() {
  if (currentIndex.value > 0) currentIndex.value--;
  else currentIndex.value = cards.value.length - 1;
}

function toggleDetails() {
  showDetails.value = !showDetails.value;
}

function speak() {
  let text: string = 'kana' in currentCard.value ? currentCard.value.kana : currentCard.value.main
  const utterance = new SpeechSynthesisUtterance(text);

  // Find Japanese female voice
  const voices = speechSynthesis.getVoices();
  const japaneseVoice = voices.filter( voice => voice.lang === 'ja-JP')
  const defaultVoice = voices.find( voice => voice.lang === 'ja-JP')
  const google = japaneseVoice.find( voice => voice.name.includes("Google"))

  if (google) {
    utterance.voice = google;
  } else if (defaultVoice) {
    utterance.voice = defaultVoice;
  }

  utterance.lang = 'ja-JP';
  utterance.rate = 1; // slower (default is 1)
  utterance.pitch = 1; // slightly higher pitch (default is 1)
  utterance.volume = 1; // max volume

  speechSynthesis.speak(utterance);
}

onMounted(loadCards)

function loadSelection (): Record<string, boolean> | undefined {
  const data = localStorage.getItem(`saved-${level}-${type}`)
  if (!data) return undefined
  return JSON.parse(data);
}

function back () {
  router.push({ name: 'WordCheck', params: { level, type } });
}
</script>
