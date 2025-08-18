# GPR Surveys

A modern web application for managing Ground Penetrating Radar (GPR) survey data and reports.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Clearflo/gpr-surveys.git
cd gpr-surveys
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
gpr-surveys/
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility functions and configurations
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/            # Static assets
└── supabase/         # Database migrations
```

## License

Private - All rights reserved
