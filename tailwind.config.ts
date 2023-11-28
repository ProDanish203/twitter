import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors:{
        text: "#ffffff",
        bg: "#000000",
        primary: "#1d9bf0",
        whiteAccent: "#eff3f4",
        darkAccent: "#16181c",
        placeolder: "#696d72",
      },
      screens:{
        xs: "550px"
      }
    },
  },
  plugins: [],
}
export default config
