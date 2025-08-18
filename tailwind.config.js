/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif']
      },
      colors: {
        primary: {
          DEFAULT: '#1e3a8a', // Dark blue
          hover: '#1e40af', // Lighter blue
          text: '#ffffff'  // White text for primary backgrounds
        },
        accent: {
          DEFAULT: '#fd8800', // Orange
          hover: '#e67a00', // Darker orange
          text: '#1e3a8a'  // Dark blue text for accent backgrounds
        },
        construction: {
          100: '#f8fafc', // Light background
          200: '#e2e8f0', // Border color
          300: '#cbd5e1', // Muted text
          400: '#94a3b8', // Secondary text
          500: '#64748b', // Body text
          600: '#475569', // Strong text
          700: '#334155', // Headings
          800: '#1e293b', // Dark background
          900: '#0f172a'  // Extra dark
        },
        blue: {
          800: '#1e40af',
          900: '#1e3a8a',
        }
      },
      fontFamily: {
        display: ['Teko', 'sans-serif'],
        condensed: ['Roboto Condensed', 'sans-serif'],
        body: ['Roboto', 'sans-serif']
      },
      backgroundImage: {
        'blueprint': "url('data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1h2v2H1V1zm4 0h2v2H5V1zm4 0h2v2H9V1zm4 0h2v2h-2V1zm4 0h2v2h-2V1zm0 4h2v2h-2V5zM1 5h2v2H1V5zm8 0h2v2H9V5zm4 0h2v2h-2V5zm4 4h2v2h-2V9zM1 9h2v2H1V9zm4 0h2v2H5V9zm4 0h2v2H9V9zm4 4h2v2h-2v-2zm4 0h2v2h-2v-2zM1 13h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2zm4 4h2v2h-2v-2zm4 0h2v2h-2v-2zM1 17h2v2H1v-2zm4 0h2v2H5v-2zm4 0h2v2H9v-2z' fill='%231e3a8a' fill-opacity='0.05'/%3E%3C/svg%3E')",
        'diagonal-lines': "url('data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40' stroke='%231e3a8a' stroke-width='1' fill='none' stroke-opacity='0.05'/%3E%3C/svg%3E')",
        'construction-pattern': "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54 0h6v6h-6V0zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zM42 0h6v6h-6V0zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zM30 0h6v6h-6V0zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zM18 0h6v6h-6V0zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zm0 12h6v6h-6v-6zM6 0h6v6H6V0zm0 12h6v6H6v-6zm0 12h6v6H6v-6zm0 12h6v6H6v-6zm0 12h6v6H6v-6z' fill='%23fd8800' fill-opacity='0.05'/%3E%3C/svg%3E')"
      },
      boxShadow: {
        'industrial': '4px 4px 0 rgba(0, 0, 0, 0.1)',
        'industrial-hover': '6px 6px 0 rgba(0, 0, 0, 0.15)'
      }
    },
  },
  plugins: [],
};
