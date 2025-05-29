const jsonFiles = import.meta.glob('/public/jlpt-*/**/*.json', { eager: true });

const flashcardData: Record<string, any> = {};

for (const path in jsonFiles) {
  const category = path.split('/').pop()?.replace('.json', '');
  if (category) {
    flashcardData[category] = jsonFiles[path];
  }
}