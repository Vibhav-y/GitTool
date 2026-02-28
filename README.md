<div align="center">

# 🚀 GitTool — README Wizard & Template Engine

</div>

[![Frontend](https://img.shields.io/badge/Frontend-Vite-blue?style=for-the-badge)](#)
[![Backend](https://img.shields.io/badge/Backend-Node%2FExpress-yellow?style=for-the-badge)](#)
[![Languages](https://img.shields.io/badge/Languages-JS%20%7C%20CSS%20%7C%20PLpgSQL%20%7C%20HTML-blue?style=for-the-badge)](#)
[![Status](https://img.shields.io/badge/Status-WIP-yellow?style=for-the-badge)](#)
[![Stars](https://img.shields.io/badge/Stars-0-ff69b4?style=for-the-badge)](#)
[![Forks](https://img.shields.io/badge/Forks-0-9cf?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/License-Unknown-yellow?style=for-the-badge)](#)

---

## 🚀 What is this?

GitTool is a full-stack playground for creating, templating, and generating READMEs and project docs, backed by a token-based, rate-limited workflow powered by Supabase authentication. It’s a two-app mono-repo (backend + frontend) with clear separation of concerns:

- Backend (Express-style structure) orchestrates auth, templates, repo contexts, README generation, and token-based controls.
  - Controllers: authController.js, readmeController.js, repoController.js, tokenController.js
  - Middleware: authMiddleware.js, errorMiddleware.js
  - Routes: authRoutes.js, readmeRoutes.js, repoRoutes.js, tokenRoutes.js
  - Utils: octokit.js (GitHub integration), repoContext.js
  - Migrations: 01_initial_schema.sql, 02_add_template_to_projects.sql, 03_token_system.sql
  - Config: backend/src/config/supabase.js
- Frontend (React + Vite) provides the UI for authentication, dashboard, templates, repositories, and project creation.
  - Key pages: CreateProject.jsx, Dashboard.jsx, EditProject.jsx, Templates.jsx, repos.jsx, Profile.jsx, auth.jsx, home.jsx
  - Contexts: AuthContext.jsx
  - CSS/Assets: App.css, index.css, logo.svg, react.svg
  - Supabase client: frontend/src/lib/supabase.js

Tech highlights you’ll see under the hood:
- README generation and refinement using a templated approach, integrated with Supabase auth middleware
- Template-to-project associations persisted via migrations
- A token system and rate-limiting mechanism to control usage
- GitHub integration helpers (octokit) for repository interactions
- A playful yet practical UI with improved global styling and route handling

---

## ✨ Features

- README generation and refinement driven by templates
- Supabase authentication integrated on both frontend and backend
- Template tables and migrations enabling project-template associations
- Token-based access control and rate limiting to manage usage
- Centralized repo context handling for consistent repo-related operations
- Clean separation of concerns: controllers, routes, and middleware
- Modern frontend with multiple pages: Dashboard, Templates, Create/Edit Project, Profile, repos
- Polished UI improvements and global styling enhancements

Files and areas that empower the above:
- backend/migrations/01_initial_schema.sql
- backend/migrations/02_add_template_to_projects.sql
- backend/migrations/03_token_system.sql
- backend/src/controllers/{authController.js, readmeController.js, repoController.js, tokenController.js}
- backend/src/middleware/{authMiddleware.js, errorMiddleware.js}
- backend/src/routes/{authRoutes.js, readmeRoutes.js, repoRoutes.js, tokenRoutes.js}
- backend/src/utils/{octokit.js, repoContext.js}
- frontend/src/{App.jsx, CreateProject.jsx, Dashboard.jsx, Templates.jsx, repos.jsx, Profile.jsx, auth.jsx, home.jsx}
- frontend/src/lib/supabase.js
- frontend/public/{logo.svg, vite.svg}
- frontend/eslint.config.js
- frontend/vercel.json
- 48 total files to explore

---

## 🛠 Installation

Prerequisites:
- Node.js and npm installed
- A PostgreSQL-compatible database (or a Supabase project)
- Basic familiarity with running SQL migrations

Step-by-step setup (local development):

1) Clone the repo
- git clone https://github.com/Vibhav-y/GitTool.git
- cd GitTool

2) Backend setup
- cd backend
- npm install
- Prepare environment
  - Create a .env with your Supabase URL and anon/public key (and any DB connection details you rely on). The codebase uses backend/src/config/supabase.js to connect with Supabase, so you’ll need:
    - SUPABASE_URL
    - SUPABASE_ANON_KEY
  - If you’re connecting to a local PostgreSQL instance, you may also configure DATABASE_URL or equivalent as used by your setup.
- Apply database migrations
  - psql -U <your_pg_username> -d <your_database> -f backend/migrations/01_initial_schema.sql
  - psql -U <your_pg_username> -d <your_database> -f backend/migrations/02_add_template_to_projects.sql
  - psql -U <your_pg_username> -d <your_database> -f backend/migrations/03_token_system.sql
  Note: If you’re using a migration tool or a containerized setup, adapt accordingly.

- Start the backend
  - npm run start (or node server.js, depending on the script defined in backend/package.json)
  - The server will boot and expose the API endpoints defined by the routes (authRoutes.js, readmeRoutes.js, repoRoutes.js, tokenRoutes.js).

3) Frontend setup
- cd frontend
- npm install
- Prepare frontend environment
  - Create a frontend environment file (e.g., .env.local) with the Supabase client keys expected by frontend/src/lib/supabase.js, such as VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
- Start the frontend dev server
  - npm run dev (Vite)
  - Open the app in your browser (default: http://localhost:5173)

4) Verification
- Navigate to the frontend UI, log in via Supabase, and explore:
  - Create a project
  - Choose or tune a template
  - Generate and refine a README
  - Manage repos and profiles
- Check that the backend logs show authentication, token checks, and readme generation flows.

Notes:
- The backend and frontend are designed to work with Supabase for auth and data storage. The frontend’s supabase client is configured in frontend/src/lib/supabase.js.
- If you’re migrating from a remote database, ensure your environment variables reflect your target environment (staging/production) and that your migrations align with your schema.

---

## 🎮 How to use

- Authentication
  - Use the frontend’s login flow, powered by Supabase authentication middleware in the backend.
  - The auth flow is wired into backend controllers and middleware to protect protected routes.

- Working with templates and READMEs
  - In the Dashboard, you can create a new project or choose an existing one.
  - Pick a template (templates are persisted with projects via migrations) and generate a README.
  - Refine the generated content as needed within the UI; the system uses Supabase-backed storage to persist refinements.

- Token-based and rate-limited access
  - The backend includes a token system and rate limiting, integrated through tokenController.js and tokenRoutes.js.
  - Tokens gate certain actions and help manage usage within your organization.

- GitHub interactions
  - The repository utilities (octokit.js) allow the app to interact with GitHub when needed (e.g., cloning, pushing generated READMEs, or syncing templates).

- File structure quick tour
  - backend/migrations: SQL migrations (schema, templates, token system)
  - backend/src/controllers: core business logic (auth, readme generation, repo ops, tokens)
  - backend/src/middleware: auth and error handling
  - backend/src/routes: organized REST routes for auth, readmes, repos, tokens
  - backend/src/utils: GitHub integration and repo context helpers
  - frontend/src/pages: UI routes for Home, Dashboard, Create/Edit Projects, Templates, Repos, Profile, Auth
  - frontend/src/contexts/AuthContext.jsx: client-side auth state
  - frontend/src/lib/supabase.js: Supabase client initialization
  - frontend/public: logo and assets
  - frontend/eslint.config.js: lint rules to keep the codebase tidy

Examples of user flows:
- Create a new project, pair it with a template, generate a README, and publish or save it to a connected repository.
- Sign in with Supabase, manage templates, and tweak generated READMEs with refinement features.
- Use tokens to control access to restricted actions and understand usage via the in-app UI.

---

## 🤝 Contributing

We’re building in public with a playful, productive vibe. If you want to help:

- Open issues to discuss features, bugs, or enhancements
- Create a feature/bug branch off main with a descriptive name
- Follow the existing conventions:
  - Use the feat:/fix: prefixes in commits
  - Keep changes small and well-scoped
- Code quality
  - Run frontend and backend linters (check frontend/eslint.config.js)
  - Ensure changes pass local startup (backend server.js + frontend dev server)
- Documentation
  - Update README or docs with any architectural changes, new endpoints, or usage notes

---

## Tech stack summary

- Frontend
  - React + Vite
  - Supabase JS client
  - CSS for styling, assets in frontend/public
  - Pages: CreateProject, Dashboard, EditProject, Templates, repos, Profile, auth, home
- Backend
  - Node.js / Express-like structure
  - PostgreSQL database (migrations in backend/migrations)
  - Supabase for authentication and data
  - Controllers: auth, readme, repo, token
  - Middleware: auth, error handling
  - Utils: octokit (GitHub), repoContext
- Data and Migrations
  - 01_initial_schema.sql
  - 02_add_template_to_projects.sql
  - 03_token_system.sql
- Misc
  - 48 files in the repo
  - Custom favicon/logo assets added (as of commits)

---

If you want a version of this README tailored to a deployment script, port-forwarding setup, or a quickstart command snippet, tell me your preferred environment (local vs. Docker vs. cloud) and I’ll tailor the steps and commands accordingly. 🚀✨

---
*Made with: [gittool.dev](https://gittool.dev)*
