import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss({
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          tertiary: 'var(--color-tertiary)',
          quaternary: 'var(--color-quaternary)',
        },
        background: {
          secondary: 'var(--color-secondary)',
          primary: 'var(--color-primary)',
          tertiary: 'var(--color-tertiary)',
          quaternary: 'var(--color-quaternary)',
        },
        text: {
          secondary: 'var(--color-secondary)',
        }

      },
    },

    plugins: [],
  })],
})
