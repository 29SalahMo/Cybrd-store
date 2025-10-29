/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0a0a0a",
        bone: "#EDE8E3",
        burgundy: "#5A1B1E",
        neon: "#00E5FF",
        magenta: "#FF1177"
      },
      fontFamily: {
        display: ["Oswald", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 15px rgba(0,229,255,0.35), 0 0 35px rgba(255,17,119,0.15)",
        glowStrong: "0 0 25px rgba(0,229,255,0.6), 0 0 55px rgba(255,17,119,0.35)"
      }
    }
  },
  plugins: []
}


