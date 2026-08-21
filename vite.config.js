import { defineConfig } from 'vite';

export default defineConfig({
  base: './', // Necessário para deploy no GitHub Pages
  build: {
    assetsInlineLimit: 0 // Impede que assets pequenos sejam convertidos em base64
  }
});
