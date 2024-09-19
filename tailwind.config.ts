import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
    darkMode: ["class"],
    content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-inter)"]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {}
  	}
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography, require("tailwindcss-animate")],
} satisfies Config;
