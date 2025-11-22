import type { Config } from 'tailwindcss'

const config: Config = {
  // 1. MODO DARK (Requisito da Etapa 9)
  darkMode: 'class',

  // 2. CONTEÚDO (Diz ao Tailwind onde olhar)
  //    Como você tem uma pasta 'src', usamos o caminho 'src/'
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    // Adicione o path do Tremor
    './node_modules/@tremor/react/**/*.{js,ts,jsx,tsx}',
  ],

  theme: {
    extend: {
      // (Você pode adicionar suas extensões de tema aqui)
    },
  },

  // 3. PLUGINS (Adiciona o plugin de formulários)
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
export default config


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ... suas extensões
    },
  },
  // !!! ADICIONE A LINHA "plugins" !!!
  plugins: [
    require('@tailwindcss/forms'),
  ],
}