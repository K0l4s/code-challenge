// src/utils/tokenImages.ts
const modules = import.meta.glob('../assets/tokens/*.svg', { eager: true, as: 'url' });

export const tokenImages: Record<string, string> = {};

for (const path in modules) {
  const fileName = path.split('/').pop()?.replace('.svg', '');
  if (fileName) tokenImages[fileName] = modules[path] as string;
}
