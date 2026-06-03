import { defineConfig } from 'vite'

export default defineConfig({
  root: 'src', // Le dice a Vite que tu index.html está dentro de la carpeta src
  build: {
    outDir: '../dist', // Le dice que saque la carpeta dist terminada a la raíz principal
    emptyOutDir: true
  }
})