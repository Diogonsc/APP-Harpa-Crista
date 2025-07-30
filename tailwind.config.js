/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx", 
    "./src/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Cores do tema claro (baseadas na paleta elegante dos modais)
        'light': {
          background: '#f9fafb', // gray-50
          surface: '#ffffff', // white
          primary: '#007AFF', // blue-500
          text: '#111827', // gray-900
          textSecondary: '#374151', // gray-700
          textTertiary: '#6b7280', // gray-500
          border: '#e5e7eb', // gray-200
          separator: '#e5e7eb', // gray-200
          icon: '#6b7280', // gray-500
          searchBackground: '#ffffff', // white
          cardBackground: '#ffffff', // white
          headerBackground: '#ffffff', // white
        },
        // Cores do tema escuro (baseadas na paleta elegante dos modais)
        'dark': {
          background: '#111827', // gray-900
          surface: '#1f2937', // gray-800
          primary: '#0A84FF', // blue-500
          text: '#ffffff', // white
          textSecondary: '#d1d5db', // gray-300
          textTertiary: '#9ca3af', // gray-400
          border: '#374151', // gray-700
          separator: '#374151', // gray-700
          icon: '#9ca3af', // gray-400
          searchBackground: '#1f2937', // gray-800
          cardBackground: '#1f2937', // gray-800
          headerBackground: '#1f2937', // gray-800
        },
        // Cores principais para uso direto
        primary: {
          DEFAULT: '#007AFF',
          dark: '#0A84FF',
        },
        background: {
          light: '#f9fafb', // gray-50
          dark: '#111827', // gray-900
        },
        surface: {
          light: '#ffffff', // white
          dark: '#1f2937', // gray-800
        },
        text: {
          primary: {
            light: '#111827', // gray-900
            dark: '#ffffff', // white
          },
          secondary: {
            light: '#374151', // gray-700
            dark: '#d1d5db', // gray-300
          },
          tertiary: {
            light: '#6b7280', // gray-500
            dark: '#9ca3af', // gray-400
          },
        },
        border: {
          light: '#e5e7eb', // gray-200
          dark: '#374151', // gray-700
        },
      },
    },
  },
  plugins: [],
}