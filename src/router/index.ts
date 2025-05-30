import { createRouter, createWebHashHistory } from 'vue-router';
import FlashcardSelector from '@/views/FlashcardSelector.vue';
import FlashcardView from '@/views/FlashcardView.vue';
import WordCheck from '@/views/WordCheck.vue';

const routes = [
  { path: '/', name: 'Home', component: FlashcardSelector },
  { path: '/:material', name: 'WordCheck', component: WordCheck },
  { path: '/:material/learning', name: 'Flashcard', component: FlashcardView },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});