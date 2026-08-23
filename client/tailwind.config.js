/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef4ff",
          100: "#dbe6fe",
          200: "#bfd1fe",
          300: "#93b2fd",
          400: "#6089fa",
          500: "#3d63f4",
          600: "#2a44e8",
          700: "#2334d1",
          800: "#232ba9",
          900: "#212a85",
          950: "#161a4f",
        },
        risk: {
          low: "#16a34a",
          medium: "#d97706",
          high: "#ea580c",
          critical: "#dc2626",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e8",
          300: "#c3c9d4",
          400: "#9aa3b5",
          500: "#727d93",
          600: "#576076",
          700: "#454c5f",
          800: "#2e3342",
          900: "#1a1d27",
          950: "#101219",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,18,25,0.04), 0 1px 12px rgba(16,18,25,0.04)",
        elevated: "0 4px 24px rgba(16,18,25,0.08)",
      },
    },
  },
  plugins: [],
};
