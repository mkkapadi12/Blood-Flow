# BloodFlow

A full-stack, real-time emergency blood and oxygen request platform. Requesters raise medical supply requests; dispatchers accept, pick up, and deliver them. Status updates flow live to both sides over WebSockets, and deliveries are confirmed with a one-time PIN.

## Features

- **Two-portal authentication** — separate registration, login, and JWT-protected dashboards for **Requesters** and **Dispatchers**.
- **Blood & Oxygen requests** — create requests with blood group, units, hospital address, urgency (`normal` / `critical`), and geo-coordinates.
- **Request lifecycle** — `searching` → `accepted` → `in-transit` → `delivered`, with a full status history audit log.
- **Real-time updates** — Socket.IO rooms scoped per request push live status and arrival events to all connected clients.
- **PIN-based delivery confirmation** — dispatcher arrives, requester verifies a 4-digit PIN to mark the request `delivered`.
- **Role-aware access control** — middleware ensures requesters only see their own requests and dispatchers only act on assignments they own.

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v7
- Redux Toolkit + React Redux
- Tailwind CSS v4 + shadcn/ui (radix-nova) + lucide-react
- Axios (public + authenticated clients)
- socket.io-client
- React Hook Form
- Sonner (toast notifications)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.IO
- JSON Web Tokens (jsonwebtoken)
- bcrypt (password hashing)
- Multer, CORS, dotenv

## Project Structure

```
Blood-Flow/
├── public/                    # Static assets (favicon, icons)
├── src/                       # React frontend
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── assets/
│   ├── components/ui/         # shadcn/ui primitives (button, card, input, label, sonner)
│   ├── lib/                   # socket client + utils
│   ├── page/
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   ├── requester/
│   │   │   ├── auth/          # RequesterLogin, RequesterRegister
│   │   │   ├── components/    # createRequest
│   │   │   └── page/          # Dashboard, MyRequests, RequestDetails
│   │   └── dispatcher/
│   │       ├── auth/          # Login, Register
│   │       └── page/          # Dashboard, singleRequest
│   ├── routes/                # Route configs (requester + dispatcher)
│   ├── services/              # PublicAPI, PrivateAPI (axios instances)
│   └── store/                 # Redux store + feature slices/APIs
└── server/                    # Express + MongoDB backend
    ├── index.js               # Entry: HTTP + Socket.IO bootstrap
    ├── config/db.js           # MongoDB connection
    ├── controllers/           # requester.controller, dispatcher.controller
    ├── middlewares/           # JWT auth (requester / dispatcher) + global error handler
    ├── models/                # Requester, Dispatcher, Request, StatusLog
    ├── routes/                # requester, dispatcher, request, volunteer
    └── socket/socket.js       # Socket.IO init + per-request rooms
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local instance or Atlas connection string)

### 1. Clone the repository

```bash
git clone <repo-url>
cd Blood-Flow
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `server/.env` file:

```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/bloodflow
JWT_SECRET_KEY=your_jwt_secret_here
```

Start the backend (with auto-reload):

```bash
npm run dev
```

Or in production mode:

```bash
npm start
```

The API will be available at `http://localhost:3000`.

### 3. Frontend setup

From the project root:

```bash
npm install
npm run dev
```

Vite will serve the app (typically at `http://localhost:5173`). The frontend expects the API at `http://localhost:3000/api` (configured in `src/services/PublicAPI.js` and `src/services/PrivateAPI.js`).

> Note: The dev port the API listens on must match the URLs in `src/services/*.js` and `src/lib/socket.js`.

## Available Scripts

### Frontend (project root)

| Script           | Description                       |
| ---------------- | --------------------------------- |
| `npm run dev`    | Start the Vite dev server         |
| `npm run build`  | Build the production bundle       |
| `npm run preview`| Preview the built bundle locally  |
| `npm run lint`   | Run ESLint                        |

### Backend (`server/`)

| Script         | Description                           |
| -------------- | ------------------------------------- |
| `npm run dev`  | Start Express with nodemon            |
| `npm start`    | Start Express in production mode      |

## API Reference

Base URL: `http://localhost:3000/api`

All protected routes require an `Authorization: Bearer <token>` header.

### Requester (`/api/requester`)

| Method | Path                              | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| POST   | `/register`                       | —    | Create a requester account           |
| POST   | `/login`                          | —    | Log in, returns JWT                  |
| GET    | `/profile`                        | ✅   | Current requester profile            |
| POST   | `/create-request`                 | ✅   | Create a blood/oxygen request        |
| GET    | `/requests/my`                    | ✅   | List the requester's own requests    |
| GET    | `/requests/:id`                   | ✅   | Get a single owned request           |
| POST   | `/requests/:id/verify-pin`        | ✅   | Verify delivery PIN → mark delivered |

### Dispatcher (`/api/dispatcher`)

| Method | Path                              | Auth | Description                          |
| ------ | --------------------------------- | ---- | ------------------------------------ |
| POST   | `/register`                       | —    | Create a dispatcher account          |
| POST   | `/login`                          | —    | Log in, returns JWT                  |
| GET    | `/profile`                        | ✅   | Current dispatcher profile           |
| GET    | `/get-all-requests`               | ✅   | All open (`searching`) requests      |
| GET    | `/get-my-requests`                | ✅   | Requests assigned to this dispatcher |
| GET    | `/requests/:id`                   | ✅   | Single request detail                |
| PUT    | `/requests/:id/accept`            | ✅   | Accept a `searching` request         |
| PUT    | `/requests/:id/pickup`            | ✅   | Mark accepted request `in-transit`   |
| PUT    | `/requests/:id/deliver`           | ✅   | Notify arrival (PIN handed off)      |

### Generic request routes (`/api/requests`, `/api/volunteer`)

Aliases that mirror requester/dispatcher endpoints under a single resource prefix — see `server/routes/request.routes.js` and `server/routes/volunteer.routes.js`.

## Real-Time Events

Socket.IO is initialized on the same HTTP server as Express. Clients connect to the server URL and join a room for a specific request:

```js
import { socket } from "@/lib/socket";

socket.emit("join-request", requestId);

socket.on("status_update", ({ requestId, status, request }) => {
  // status moved to accepted / in-transit / delivered
});

socket.on("arrival_update", ({ requestId, deliveryPin, request }) => {
  // dispatcher has arrived; requester should enter PIN
});

socket.emit("leave-request", requestId);
```

| Event             | Direction        | Payload                                        |
| ----------------- | ---------------- | ---------------------------------------------- |
| `join-request`    | Client → Server  | `requestId`                                    |
| `leave-request`   | Client → Server  | `requestId`                                    |
| `status_update`   | Server → Client  | `{ requestId, status, request }`               |
| `arrival_update`  | Server → Client  | `{ requestId, status, deliveryPin, request }`  |

## Request Lifecycle

```
[Requester creates request]
          │
          ▼
      searching ──(dispatcher accepts)──► accepted
                                              │
                                  (dispatcher picks up)
                                              ▼
                                         in-transit
                                              │
                              (dispatcher arrives → arrival_update)
                                              │
                            (requester enters delivery PIN)
                                              ▼
                                         delivered
```

Every state change is persisted via a `StatusLog` document linked to the request, so the full history is auditable.

## Data Models

- **Requester** — `name`, `email` (unique), `password` (bcrypt-hashed); JWT `requesterId` issued on auth.
- **Dispatcher** — `name`, `email` (unique), `password` (bcrypt-hashed); JWT `dispatcherId` issued on auth.
- **Request** — `requester`, `dispatcher`, `type` (`blood`/`oxygen`), `bloodGroup`, `units`, `hospital`, `urgency`, `location {lat, lng}`, `status`, `deliveryPin`, `pinVerified`, `statusHistory[]`, timestamps.
- **StatusLog** — `request`, `changedBy`, `changedByRole` (`requester`/`dispatcher`), `newStatus`, `timestamp`.

## Path Aliases

Both Vite and `jsconfig.json` map `@/*` → `src/*`, so imports like `@/components/ui/button` and `@/lib/socket` resolve from anywhere in the frontend.

## License

Add a license of your choice (e.g., MIT) to this repository.
