/** @type {import('tailwindcss').Config} */
export default {
  content: [ "./index.html", "./src/**/*.{js,ts,jsx,tsx}", ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#C7A64A',
          ink: '#111111',
          soft: '#F8F5EA',
        },
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        premiumfragrance: {
          primary: '#C7A64A',
          'primary-content': '#111111',
          secondary: '#2F2A18',
          'secondary-content': '#F8F5EA',
          accent: '#E5D39A',
          neutral: '#1B1B1B',
          'base-100': '#FFFFFF',
          'base-200': '#F8F8F8',
          'base-300': '#ECECEC',
          'base-content': '#111111',
          info: '#2563EB',
          success: '#15803D',
          warning: '#CA8A04',
          error: '#DC2626',
        },
      },
    ],
  },
}

