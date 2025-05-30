<template>
  <div class="min-h-screen flex flex-col items-center justify-center gap-4 p-4">
    <h1 class="text-2xl font-bold">English Flashcard</h1>
    <h3 class="text-lg">Source: {{ source }}</h3>
    <div class="grid grid-cols-2 gap-4">
      <button
        v-for="list in lists"
        :key="list"
        class="flex flex-col px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        @click="selectType(list)"
      >
        <span>{{ capitalizeAll(list) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import capitalizeAll from '@/utils/capitalize-all'

const router = useRouter()
const source = ref("test-english")
const lists = ref<string[]>([])

function selectType(material: string) {
  router.push({ name: 'WordCheck', params: { material } })
}

onMounted(async () => {
  const response = await fetch(`/test-english/json/menu.json`)
  lists.value = await response.json() as string[]
})
</script>
