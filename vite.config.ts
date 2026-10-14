import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Ruta base parametrizable para GitHub Pages:
//   - Dominio raíz o desarrollo local: BASE_PATH sin definir → '/'
//   - Repositorio de proyecto: BASE_PATH=/NOMBRE_REPOSITORIO/ npm run build
// El workflow de GitHub Actions la calcula automáticamente a partir del nombre del repositorio.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173, strictPort: false },
  preview: { port: 4173 },
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
});
