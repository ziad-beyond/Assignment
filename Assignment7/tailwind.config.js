/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          

"primary": "red",
          
"neutral": "white",
          

"base-100": "black",

"error": "#881337",
          },
        },
      ],
    },
  plugins: [require('daisyui'),],
  
}

