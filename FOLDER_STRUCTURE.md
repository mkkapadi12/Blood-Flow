# BloodFlow — Folder Structure Audit & Professional Reorganization Plan

This document audits the **current** project folder structure, lists everything that does not match industry conventions, and proposes a **clean, scalable, professional layout** for both the React frontend and the Express/MongoDB backend.

---

## 1. Current Folder Structure

```
Blood-Flow/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/                                # Frontend (React + Vite)
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg                   # default Vite asset (unused)
│   │   └── vite.svg                    # default Vite asset (unused)
│   ├── components/
│   │   └── ui/                         # only shadcn primitives, no shared components
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       └── sonner.jsx
│   ├── lib/
│   │   ├── socket.js
│   │   └── utils.js
│   ├── page/                           # singular "page" (convention is "pages")
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── dispatcher/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   └── page/                   # nested "page" inside "page" — confusing
│   │   │       ├── Dashboard.jsx
│   │   │       └── singleRequest.jsx   # camelCase, inconsistent with siblings
│   │   └── requester/
│   │       ├── auth/
│   │       │   ├── RequesterLogin.jsx  # redundant prefix (already inside requester/)
│   │       │   └── RequesterRegister.jsx
│   │       ├── components/             # feature-local components
│   │       │   └── createRequest.jsx   # camelCase
│   │       ├── layout/                 # empty folder
│   │       └── page/
│   │           ├── Dashboard.jsx
│   │           ├── MyRequests.jsx
│   │           └── RequestDetails.jsx
│   ├── routes/
│   │   ├── index.jsx
│   │   ├── dispatcherRoutes.jsx
│   │   └── requesterRoutes.jsx
│   ├── services/
│   │   ├── PrivateAPI.js               # PascalCase filename, lowercase variable
│   │   └── PublicAPI.js
│   └── store/
│       ├── store.js
│       └── features/
│           ├── dispatcher/
│           │   ├── dispatcher.api.js
│           │   └── dispatcher.slice.js
│           └── requester/
│               ├── requester.api.js
│               └── requester.slice.js
└── server/                             # Backend (Express + MongoDB)
    ├── .env                            # committed-looking; keep ignored
    ├── index.js                        # all bootstrap, CORS, routes wiring inline
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── dispatcher.controller.js    # auth + request lifecycle in one file
    │   └── requester.controller.js     # auth + request lifecycle in one file
    ├── middlewares/
    │   ├── dispatcher.middleware.js
    │   ├── error.middleware.js
    │   └── requester.middleware.js
    ├── models/
    │   ├── dispatcher.model.js
    │   ├── request.model.js
    │   ├── requester.model.js
    │   └── status.model.js
    ├── routes/
    │   ├── dispatcher.routes.js
    │   ├── request.routes.js           # duplicates requester/dispatcher endpoints
    │   ├── requester.routes.js
    │   └── volunteer.routes.js         # references "volunteer" but no model exists
    └── socket/
        └── socket.js
```

---

## 2. Is This a Professional Folder Structure?

**Short answer: not yet.** The skeleton is reasonable for a learning/MVP project, but it has several issues that would be flagged in a professional code review or onboarding context.

### 2.1 Frontend Issues

| # | Issue | Why it's a problem |
|---|-------|--------------------|
| 1 | `src/page/` (singular) | Convention is `pages/`. Singular is unusual and reads awkwardly with imports. |
| 2 | Nested `page/.../page/` | A folder named `page` inside another folder named `page` is confusing and adds depth without value. |
| 3 | Inconsistent file casing | `Login.jsx` vs `singleRequest.jsx` vs `createRequest.jsx`. React components must consistently use **PascalCase**. |
| 4 | Redundant filename prefixes | `RequesterLogin.jsx` lives inside `requester/auth/` — the prefix is duplicated by the path. |
| 5 | Empty `layout/` folder | Either remove it or actually put a layout in it. |
| 6 | `components/` only contains `ui/` | No place for shared/common app components, feature components, forms, or layouts. |
| 7 | API endpoint URL hardcoded | `http://localhost:3000/api` is repeated in `PublicAPI.js`, `PrivateAPI.js`, and `lib/socket.js`. Should come from env. |
| 8 | LocalStorage keys leak app name | `requestertestToken`, `dispatchertestToken` — leftover from when the project was named "test"; should be a constant. |
| 9 | `services/` only holds axios instances | Real API calls live in `store/features/*/*.api.js` — the boundary between "service" and "store" is muddled. |
| 10 | No `hooks/`, `constants/`, `config/`, `types/`, `utils/` separation | Every grown frontend ends up needing these. |
| 11 | `routes/index.jsx` only re-exports | Fine, but route configuration is split with no obvious entry pattern (public vs private vs role-guarded). |
| 12 | Default Vite assets still in `assets/` | `react.svg`, `vite.svg` are scaffold artifacts and should be deleted. |
| 13 | No protected/role-guarded route wrapper | Any user can hit `/dispatcher/dashboard` directly today. |
| 14 | No env file (`.env.example`) for the frontend | Onboarding contributors have to guess what to set. |

### 2.2 Backend Issues

| # | Issue | Why it's a problem |
|---|-------|--------------------|
| 1 | Controllers do too much | `requester.controller.js` and `dispatcher.controller.js` mix auth, profile, request CRUD, and status transitions. |
| 2 | No service / business-logic layer | Mongoose calls, validation, and Socket emits are inlined in controllers. Hard to unit test. |
| 3 | Route duplication | `request.routes.js` re-exports requester/dispatcher endpoints under a different prefix. Two truths for one resource. |
| 4 | Phantom routes | `volunteer.routes.js` is wired up but there is no Volunteer model or controller. |
| 5 | No request validation layer | Validation is hand-rolled inside controllers (`createRequest`). Belongs in middleware (e.g. zod / express-validator). |
| 6 | `socket/socket.js` is monolithic | Connection, room-join logic, and emit helpers will grow; events should live per-feature. |
| 7 | `.env` in repo working tree | Gitignored, but easy to leak — keep an `.env.example` instead. |
| 8 | No `utils/` or `constants/` | Status enums (`["searching", "accepted", "in-transit", "delivered"]`) and roles are stringly-typed across files. |
| 9 | `index.js` does everything | App bootstrap, CORS config, route mounting, server creation, and Socket init are all in one ~50-line file. |
| 10 | No tests directory | No `__tests__/`, `tests/`, or test runner configured. |
| 11 | No API documentation | No Swagger/Postman collection in repo. |
| 12 | Inconsistent pluralization in routes | `/api/requester` (singular) vs `/api/requests` (plural) vs `/api/dispatcher` (singular). |

### 2.3 Repo-Level Issues

- `package.json` `name` is `"test"` — should be `"bloodflow-client"` (or similar).
- No monorepo tooling (npm workspaces, Turborepo) although `server/` and frontend live in the same repo with separate `package.json`s.
- No `.editorconfig`, no Prettier config, no Husky / lint-staged.
- No CI workflow (`.github/workflows/`).
- No `LICENSE`.
- README is minimal (recently expanded).

### 2.4 Verdict

> The structure is **functional for an MVP** but **not yet production-grade**. It would not pass a senior engineering review without the changes proposed below.

---

## 3. Proposed Professional Folder Structure

The goal is **feature-first organization**, **clear separation of concerns**, **consistent casing**, and **room to grow** (testing, CI, multiple environments).

### 3.1 Top-Level Layout

```
Blood-Flow/
├── client/                         # Renamed from implicit root → explicit "client"
├── server/                         # Express API
├── docs/                           # Architecture, API docs, diagrams
├── .github/
│   └── workflows/                  # CI: lint, test, build
├── .editorconfig
├── .prettierrc
├── .gitignore
├── LICENSE
├── README.md
└── FOLDER_STRUCTURE.md             # this file
```

> If you prefer to keep the frontend at the repo root (current setup), apply only the `src/` reorganization in §3.2 and leave the top level alone.

### 3.2 Frontend — `client/src/`

```
client/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── .env.example                    # VITE_API_URL, VITE_SOCKET_URL
├── package.json
├── vite.config.js
├── jsconfig.json
├── eslint.config.js
└── src/
    ├── main.jsx                    # entry: ReactDOM.render
    ├── App.jsx                     # router + providers
    ├── index.css
    │
    ├── assets/                     # images, fonts, icons (PROJECT-OWNED only)
    │   └── hero.png
    │
    ├── config/                     # static configuration
    │   ├── env.js                  # reads import.meta.env.VITE_* safely
    │   ├── routes.js               # route path constants (e.g. ROUTES.REQUESTER.LOGIN)
    │   └── storage-keys.js         # localStorage key constants
    │
    ├── constants/                  # domain enums shared with server
    │   ├── request-status.js       # SEARCHING, ACCEPTED, IN_TRANSIT, DELIVERED
    │   ├── urgency.js              # NORMAL, CRITICAL
    │   ├── request-type.js         # BLOOD, OXYGEN
    │   └── roles.js                # REQUESTER, DISPATCHER
    │
    ├── lib/                        # third-party clients / low-level helpers
    │   ├── axios.js                # base axios instance + interceptors
    │   ├── socket.js               # socket.io-client setup
    │   └── utils.js                # cn(), formatters, etc.
    │
    ├── components/                 # truly shared, reusable UI
    │   ├── ui/                     # shadcn primitives (button, card, input, label, sonner)
    │   ├── common/                 # Logo, Loader, EmptyState, ErrorBoundary
    │   ├── forms/                  # FormField, PasswordInput
    │   └── layouts/                # AppLayout, AuthLayout, DashboardLayout
    │
    ├── hooks/                      # cross-cutting hooks
    │   ├── use-auth.js
    │   ├── use-socket.js
    │   ├── use-debounce.js
    │   └── use-toast.js
    │
    ├── features/                   # FEATURE-FIRST: each feature is self-contained
    │   ├── auth/
    │   │   ├── api/
    │   │   │   ├── requester-auth.api.js
    │   │   │   └── dispatcher-auth.api.js
    │   │   ├── components/
    │   │   │   ├── LoginForm.jsx
    │   │   │   └── RegisterForm.jsx
    │   │   ├── pages/
    │   │   │   ├── RequesterLoginPage.jsx
    │   │   │   ├── RequesterRegisterPage.jsx
    │   │   │   ├── DispatcherLoginPage.jsx
    │   │   │   └── DispatcherRegisterPage.jsx
    │   │   ├── store/
    │   │   │   └── auth.slice.js
    │   │   └── index.js            # barrel export
    │   │
    │   ├── requester/
    │   │   ├── api/
    │   │   │   └── requester.api.js
    │   │   ├── components/
    │   │   │   ├── CreateRequestForm.jsx
    │   │   │   └── RequestCard.jsx
    │   │   ├── pages/
    │   │   │   ├── RequesterDashboardPage.jsx
    │   │   │   ├── MyRequestsPage.jsx
    │   │   │   └── RequestDetailsPage.jsx
    │   │   ├── store/
    │   │   │   └── requester.slice.js
    │   │   └── index.js
    │   │
    │   └── dispatcher/
    │       ├── api/
    │       │   └── dispatcher.api.js
    │       ├── components/
    │       │   ├── RequestQueue.jsx
    │       │   └── StatusActions.jsx
    │       ├── pages/
    │       │   ├── DispatcherDashboardPage.jsx
    │       │   └── SingleRequestPage.jsx
    │       ├── store/
    │       │   └── dispatcher.slice.js
    │       └── index.js
    │
    ├── pages/                      # ONLY cross-feature top-level pages
    │   ├── HomePage.jsx
    │   └── NotFoundPage.jsx
    │
    ├── routes/                     # routing config + guards
    │   ├── index.jsx               # combines public + role routes into <RouterProvider/>
    │   ├── public-routes.jsx
    │   ├── requester-routes.jsx
    │   ├── dispatcher-routes.jsx
    │   ├── ProtectedRoute.jsx      # role-aware guard
    │   └── PublicRoute.jsx         # redirects authed users away from /login
    │
    ├── store/
    │   ├── index.js                # configureStore (renamed from store.js)
    │   └── root-reducer.js
    │
    └── tests/                      # vitest + React Testing Library
        ├── setup.js
        └── (mirror of features/)
```

#### Naming conventions (frontend)

- **Components & pages** → `PascalCase.jsx` (always with `Page` suffix for routed views: `RequesterDashboardPage.jsx`).
- **Hooks** → `use-kebab-case.js`, default export named `useThing`.
- **Slices / API files** → `kebab-case.slice.js`, `kebab-case.api.js`.
- **Constants** → `UPPER_SNAKE_CASE` exported from `kebab-case.js` files.
- **Folders** → `kebab-case` or `lowercase`. Never `PascalCase` for folders.

### 3.3 Backend — `server/`

```
server/
├── .env.example                    # commit this; gitignore .env
├── package.json
├── server.js                       # ONLY: import app, init socket, listen
└── src/
    ├── app.js                      # express app: middleware, routes, error handler
    │
    ├── config/
    │   ├── env.js                  # reads & validates process.env (e.g. with zod)
    │   ├── db.js                   # mongoose connect
    │   └── cors.js                 # cors options
    │
    ├── constants/
    │   ├── request-status.js
    │   ├── urgency.js
    │   ├── request-type.js
    │   └── roles.js
    │
    ├── api/                        # FEATURE-FIRST per resource
    │   ├── auth/
    │   │   ├── auth.requester.controller.js
    │   │   ├── auth.dispatcher.controller.js
    │   │   ├── auth.routes.js
    │   │   ├── auth.service.js
    │   │   └── auth.validators.js
    │   │
    │   ├── requesters/
    │   │   ├── requester.controller.js
    │   │   ├── requester.routes.js
    │   │   ├── requester.service.js
    │   │   └── requester.validators.js
    │   │
    │   ├── dispatchers/
    │   │   ├── dispatcher.controller.js
    │   │   ├── dispatcher.routes.js
    │   │   ├── dispatcher.service.js
    │   │   └── dispatcher.validators.js
    │   │
    │   └── requests/               # the actual blood/oxygen request resource
    │       ├── request.controller.js
    │       ├── request.routes.js
    │       ├── request.service.js  # state-transition business logic
    │       └── request.validators.js
    │
    ├── models/
    │   ├── requester.model.js
    │   ├── dispatcher.model.js
    │   ├── request.model.js
    │   └── status-log.model.js     # renamed from status.model.js for clarity
    │
    ├── middlewares/
    │   ├── error.middleware.js
    │   ├── not-found.middleware.js
    │   ├── auth.middleware.js      # generic JWT verifier (role-agnostic)
    │   ├── require-role.middleware.js   # require-role("requester"|"dispatcher")
    │   └── validate.middleware.js  # runs zod schemas
    │
    ├── socket/
    │   ├── index.js                # initSocket, getIO
    │   ├── handlers/
    │   │   └── request.handler.js  # join-request / leave-request / emits
    │   └── events.js               # event-name constants
    │
    ├── utils/
    │   ├── async-handler.js        # wraps async controllers, forwards to next()
    │   ├── jwt.js                  # sign / verify helpers
    │   ├── api-error.js            # custom Error class with statusCode
    │   └── api-response.js         # uniform response shape
    │
    └── tests/                      # jest / supertest
        ├── setup.js
        └── (mirror of api/)
```

#### Why split controllers & services?

- **Controller** — parses request, calls service, formats response. Thin.
- **Service** — pure business logic over models. Easily unit-testable.
- **Validator** — zod/Joi schema, mounted via `validate.middleware.js`.
- **Routes** — wires `validate → auth → controller`.

#### Naming conventions (backend)

- All filenames → `kebab-case.js` with explicit suffix: `*.controller.js`, `*.service.js`, `*.routes.js`, `*.model.js`, `*.validators.js`, `*.middleware.js`.
- One default export per file where reasonable; named exports for utilities.
- Mongoose models: PascalCase variable (`const Requester = ...`), file kebab-case.

---

## 4. Migration Plan (Step-by-Step)

Apply the moves in order; run the app after each step so you can isolate breakage.

### Step 1 — Cleanups (no code moves)

1. Delete `src/assets/react.svg` and `src/assets/vite.svg`.
2. Delete the empty `src/page/requester/layout/` folder.
3. Rename `package.json` `"name": "test"` → `"bloodflow-client"`.
4. Add `client/.env.example` and `server/.env.example`.

### Step 2 — Centralize config

1. Create `src/config/env.js`:
   ```js
   export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
   export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3000";
   ```
2. Update `src/services/PublicAPI.js`, `src/services/PrivateAPI.js`, and `src/lib/socket.js` to import from `@/config/env`.
3. Create `src/config/storage-keys.js` and replace `"requestertestToken"` / `"dispatchertestToken"` with named constants.

### Step 3 — Frontend rename pass

1. `src/page/` → `src/pages/`.
2. Flatten `src/pages/requester/page/` → `src/features/requester/pages/`.
3. Flatten `src/pages/dispatcher/page/` → `src/features/dispatcher/pages/`.
4. Move auth pages to `src/features/auth/pages/`.
5. Rename files to `*Page.jsx` and use PascalCase consistently (`singleRequest.jsx` → `SingleRequestPage.jsx`, `createRequest.jsx` → `CreateRequestForm.jsx`).
6. Move slices and API files into the matching `features/<name>/store/` and `features/<name>/api/`.

### Step 4 — Add hooks & guards

1. Create `src/hooks/use-auth.js` (reads token + decoded JWT).
2. Create `src/routes/ProtectedRoute.jsx` and wrap dispatcher/requester routes.
3. Replace inline `localStorage.getItem(...)` reads with `useAuth()`.

### Step 5 — Backend reorganization

1. Move `index.js` → split into `server.js` (listen) + `src/app.js` (express config).
2. Create `src/api/<resource>/` folders and move controllers/routes into them.
3. Extract business logic from controllers into `*.service.js`.
4. Add `validators` using zod and a `validate.middleware.js`.
5. Remove `volunteer.routes.js` (no model backs it) **or** add a Volunteer feature properly.
6. Decide one canonical resource path: drop `/api/requests` aliases that duplicate `/api/requester/...` and `/api/dispatcher/...`, **or** invert it (recommended) — keep only `/api/requests` and `/api/auth/*`.

### Step 6 — Tooling

1. Add Prettier + ESLint config at the root.
2. Add Husky + lint-staged: format and lint on commit.
3. Add a GitHub Actions workflow: install → lint → build → test.
4. Add Vitest (frontend) and Jest+Supertest (backend) skeletons.

### Step 7 — Documentation

1. Move screenshots/diagrams to `docs/`.
2. Add `docs/api.md` (or generate Swagger).
3. Add `docs/architecture.md` describing the request lifecycle and Socket events.

---

## 5. Quick Wins (do these first, in 30 minutes)

- [ ] Rename `src/page/` → `src/pages/`.
- [ ] Rename `singleRequest.jsx` → `SingleRequestPage.jsx`, `createRequest.jsx` → `CreateRequestForm.jsx`.
- [ ] Delete unused `react.svg` / `vite.svg` and the empty `layout/` folder.
- [ ] Replace hardcoded `http://localhost:3000` strings with a single env-driven constant.
- [ ] Replace `"requestertestToken"` / `"dispatchertestToken"` with named constants.
- [ ] Change `package.json` `"name"` from `"test"` to `"bloodflow-client"`.
- [ ] Add `.env.example` files for both client and server.
- [ ] Remove `server/routes/volunteer.routes.js` until a Volunteer feature actually exists.

---

## 6. TL;DR

The current structure works, but it has inconsistent casing, redundant folder nesting (`page/.../page/`), hardcoded config, no validation/service layer, no tests, and leftover scaffolding artifacts. Adopting the **feature-first** layout in §3 — both on the client and server — will make the codebase genuinely professional, easier to onboard onto, and ready to scale beyond an MVP.
