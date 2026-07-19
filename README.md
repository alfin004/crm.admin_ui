# User Management UI

React + Vite + Tailwind admin UI built from the provided screenshots and integrated with the local API.

## Environment

Create `.env` when you want to override the API URL:

```bash
VITE_BASE_URL=http://localhost:8000
```

If `VITE_BASE_URL` is not set, the app defaults to `http://localhost:8000`.

## Run Locally

```bash
npm install
npm install react-router-dom lucide-react @headlessui/react tailwindcss @tailwindcss/vite
npm run dev

The app runs at the Vite local URL shown in the terminal, usually `http://localhost:5173/`.
