/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#5C59C2",
          secondary: "#F6F7FB",
          accent: "#EFEFEF",
          neutral: "#1A1A1A",
          "base-100": "#FFFFFF",
        },
        dark: {
          primary: "#5C59C2",
          secondary: "#1A1A1A",
          accent: "#121212",
          neutral: "#FFFFFF",
          "base-100": "#000000",
        },
      },
    ],
  },
};
