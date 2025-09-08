
# Crowdr Web App

[![Crowdr Logo](https://blog.oncrowdr.com/content/images/size/w720/2025/06/CROWDR_logo---wordmark_GREEN.png)](https://blog.oncrowdr.com/)

>This is a [Next.js](https://nextjs.org/) project for the Crowdr platform. It is a full-featured web application for campaign management, donations, volunteering, and user profiles.

---

## Project Structure

### `api/`
Backend API route handlers and models for different resources:
- `_campaigns/`, `_my_campaigns/`, `_profile/`, `_settings/`, `_users/`, `_withdrawals/`: Each contains route logic and models for their respective domain (campaigns, user campaigns, profiles, settings, users, withdrawals).
- `query/`: Custom React Query hooks and query keys for fetching campaign data.
- `types/`: Type definitions for API responses and models.
- `index.ts`: Main API entry point.

### `app/`
Next.js app directory (routing, layouts, error handling):
- `app.tsx`, `layout.tsx`: Main app and layout components.
- `error.tsx`, `global-error.jsx`, `not-found.tsx`, `loading.tsx`: Error and loading UI.
- `_components/`: Shared UI components for the app.
- `(auth)/`, `(homepage)/`, `(protected)/`, `(unprotected)/`: Route groups for authentication, homepage, protected, and public pages.

### `components/`
Reusable UI components (buttons, modals, inputs, dropdowns, etc.):
- Includes `Button.tsx`, `Modal.tsx`, `Toast.tsx`, form inputs, and more.
- `ui/`: Additional UI elements.
- `OldModal/`: Legacy modal components.

### `contexts/`
React Context Providers for global state:
- `AppProvider.tsx`: App-wide state.
- `UserProvider.tsx`: User authentication and profile state.

### `hooks/`
Custom React hooks for data fetching, modals, authentication, clipboard, window size, etc.

### `lib/`
Utility functions and helpers:
- `error.ts`, `session.ts`, `time.ts`, `utils.ts`: Error handling, session management, time utilities, general helpers.
- `constants/`: Shared constants.

### `public/`
Static assets:
- Images, fonts, SVGs, icons, and static HTML/CSS files.

### `services/`
Service modules for external APIs and business logic (e.g., `publicCampaigns.ts`).

### `styles/`
Global and component CSS files (Tailwind, custom styles).

### `types/`
TypeScript type definitions for campaigns, users, withdrawals, KYC, etc.

### `utils/`
General utility functions for API calls, formatting, error extraction, cookies, etc.

---

## Other Files
- `package.json`: Project dependencies and scripts.
- `tsconfig.json`: TypeScript configuration.
- `next.config.js`: Next.js configuration (redirects, image domains, etc.).
- `dockerfile`: Docker setup for containerized deployment.
- `.env`: Environment variables (not committed).
- `.eslintrc.json`: ESLint configuration.
- `netlify.toml`: Netlify deployment config.
- `postcss.config.js`, `tailwind.config.js`: CSS tooling configs.

---

## Local Development Setup

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd crowdr-web-app
	```

2. **Install dependencies:**
	```bash
	npm install
	# or
	yarn install
	```

3. **Set up environment variables:**
	- Copy `.env.example` to `.env` and fill in required values (API keys, secrets, etc.).

4. **Run the development server:**
	```bash
	npm run dev
	# or
	yarn dev
	```
	The app will be available at [http://localhost:3000](http://localhost:3000).

5. **Lint and build (optional):**
	```bash
	npm run lint   # Check code style
	npm run build  # Build for production
	npm start      # Start production server
	```

---

## Deployment

You can deploy on [Vercel](https://vercel.com/) or [Netlify](https://www.netlify.com/) using the provided configs. For Docker, use the included `dockerfile`.

---

## Contributing

Feel free to open issues or submit pull requests. For questions, contact the maintainers.
