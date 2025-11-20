# Wallet App Frontend

A Vue 3 + Vite single-page application for managing wallet balances, transferring money, and viewing transaction history. It uses Pinia for state management, Vue Router for navigation, Tailwind CSS for styling, and Sonner for toast notifications.

## Features
- **Authentication-aware routing:** Vue Router guards redirect unauthenticated users away from protected pages like the dashboard and transfer flow.
- **Dashboard overview:** Displays the current wallet balance and paginated transaction history with loading states and badge indicators for sent/received transfers.
- **Money transfer form:** Guided transfer experience with validation powered by `vee-validate` and `zod`.
- **Real-time updates:** Pusher/Laravel Echo channel wiring keeps transaction data in sync without manual refreshes.
- **Reusable UI primitives:** Card, Button, Badge, and iconography components to keep the interface consistent.

## Technology Stack
- [Vue 3](https://vuejs.org/) with the Composition API
- [Vite](https://vitejs.dev/) for dev server and bundling
- [Pinia](https://pinia.vuejs.org/) for state management
- [Vue Router](https://router.vuejs.org/) for navigation and route guards
- [Tailwind CSS](https://tailwindcss.com/) (with animate and merge utilities)
- [vee-validate](https://vee-validate.logaretm.com/) + [zod](https://zod.dev/) for form validation
- [Laravel Echo](https://laravel.com/docs/broadcasting#client-installation) + [Pusher](https://pusher.com/) for realtime updates
- [Vitest](https://vitest.dev/) for unit testing
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) for linting/formatting

## Prerequisites
- Node.js \(>=20.19.0\)
- [pnpm](https://pnpm.io/) (project is pinned via `packageManager`)

## Environment Variables
Create a `.env` file (or `.env.local` for overrides) in the project root before running the app:

```bash
VITE_API_BASE_URL=https://api.example.com       # Backend base URL used by the HTTP client
VITE_PUSHER_APP_KEY=your-pusher-key              # Pusher key for realtime updates
VITE_PUSHER_APP_CLUSTER=eu                       # Pusher cluster
VITE_BASE_URL=/                                  # Public base path if you deploy under a subdirectory
```

## Installation
Install dependencies with pnpm:

```bash
pnpm install
```

## Development
Start the Vite dev server with hot module reloading:

```bash
pnpm dev
```
The app will be available at the URL printed in the terminal (defaults to `http://localhost:5173`).

## Production Build & Preview
Generate an optimized production build:

```bash
pnpm build
```

Preview the production bundle locally (serves the `dist/` directory):

```bash
pnpm preview
```

You can deploy the contents of `dist/` to any static host (e.g., Nginx, Netlify, Vercel). Ensure the environment variables above are provided through your hosting platform so the app can reach the API and Pusher.

## Testing and Quality
- Run unit tests: `pnpm test:unit`
- Lint and auto-fix: `pnpm lint`
- Format source files: `pnpm format`
- Type-check Vue + TypeScript: `pnpm type-check`

## Project Structure
Key directories to explore:
- `src/components/` – Dashboard widgets, forms, header, and UI primitives.
- `src/views/` – Top-level routed pages (dashboard, login, transfer flow).
- `src/router/` – Route definitions and auth middleware.
- `src/stores/` – Pinia stores for auth and transactions.
- `src/composable/` – Reusable logic like API client and realtime channels.
- `src/services/` – HTTP client and Echo/Pusher setup.
- `src/utils/` – Helpers such as currency formatting.

## Scripts
Package.json includes convenience scripts:

| Script | Description |
| ------ | ----------- |
| `pnpm dev` | Start the development server. |
| `pnpm build` | Type-check, then build the production bundle. |
| `pnpm preview` | Serve the built `dist/` folder locally. |
| `pnpm test:unit` | Run unit tests with Vitest. |
| `pnpm lint` | Lint and auto-fix issues. |
| `pnpm format` | Format source files with Prettier. |
| `pnpm type-check` | Type-check Vue components with `vue-tsc`. |

## Getting Help
If you run into issues, verify that your Node and pnpm versions satisfy the requirements and that your environment variables are set correctly. Consult the tooling docs linked above for deeper configuration guidance.
