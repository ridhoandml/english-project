<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'

onMounted(() => {
  document.body.classList.add('bg-gray-900', 'text-white');
})
</script>

<template>
  <RouterView />
</template>