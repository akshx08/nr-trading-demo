import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        night: "#0B0C0E",
        soot: "#111318",
        iron: "#171A20",
        line: "rgba(214,219,228,0.14)",
        line2: "rgba(214,219,228,0.07)",
        bone: "#EDEFF3",
        ash: "#9AA2AE",
        mute: "#5E6673",
        accent: "rgb(var(--accent) / <alpha-value>)",
        accent2: "rgb(var(--accent-hi) / <alpha-value>)"
      },
      fontFamily: {
        disp: ["var(--font-anton)"],
        label: ["var(--font-jost)"],
        body: ["var(--font-inter)"]
      },
      transitionTimingFunction: {
        house: "cubic-bezier(0.22,1,0.36,1)",
        drawer: "cubic-bezier(0.4,0,0.2,1)"
      }
    }
  },
  plugins: []
} satisfies Config;
