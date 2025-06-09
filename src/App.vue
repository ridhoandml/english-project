<script setup lang="ts">
import { onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { onMounted, onUnmounted } from 'vue';
import { RouterView } from 'vue-router'
import initializationFirebase from './firebase/initialization';
import { storeToRefs } from 'pinia';
import { useAuth } from './store/auth';
import { updateUserData } from './firebase/english-progress';

let unsubscribeAuth: Unsubscribe | undefined

const authStore = useAuth()
const { user } = storeToRefs(authStore)

onMounted(() => {
  document.body.classList.add('bg-gray-900', 'text-white')

  const firebase = initializationFirebase()
  unsubscribeAuth = onAuthStateChanged(firebase.auth, async (currentUser) => {
    authStore.setUser(currentUser)

    if (user.value) await updateUserData(user.value?.uid, {
      name: user.value.displayName!,
      email: user.value.email!
    })
  })
})

onUnmounted(() => {
  if (unsubscribeAuth) unsubscribeAuth()
})
</script>

<template>
  <RouterView />
</template>