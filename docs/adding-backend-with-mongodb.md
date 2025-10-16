# MongoDB + Clerk Integration Guide

The to-do list now ships with a production-ready backend that persists data in MongoDB and secures every request with Clerk. This document explains how to configure your environment, how the data layer is organised, and what to expect when extending the feature set.

## 1. Prerequisites

- A MongoDB deployment (Atlas or self-hosted).
- A Clerk project with Webhooks disabled (not required) and the following keys:
  - **Publishable key** (browser-safe).
  - **Secret key** (server-only).
- Node.js 18+ and `pnpm`.

Copy `.env.example` to `.env.local` and fill in the real secrets:

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Public key for the Clerk frontend SDK. |
| `CLERK_SECRET_KEY` | Private key used on the server to verify sessions. |
| `CLERK_SIGN_IN_URL` | Custom sign-in route (`/login`). |
| `CLERK_SIGN_UP_URL` | Custom sign-up route (`/sign-up`). |
| `MONGODB_URI` | Connection string for your MongoDB cluster. |
| `MONGODB_DB` | Database name (defaults to `todo` when omitted). |

> ℹ️ The repository already ignores `.env.local`, so you can safely keep credentials out of version control.

## 2. Install dependencies

The application relies on two new runtime packages:

```bash
pnpm add @clerk/nextjs mongodb
```

If your network blocks direct installs, edit `package.json` and run the command when you have connectivity.

## 3. Connection helper (`lib/mongodb.ts`)

A single helper coordinates the database connection for every API route:

```ts
export async function getTodosCollection() {
  const client = await getMongoClient()
  const dbName = process.env.MONGODB_DB || "todo"
  return client.db(dbName).collection<TodoDocument>("todos")
}
```

The helper reuses the same client across hot reloads in development and across serverless invocations in production to avoid exhausting connection pools.

## 4. Data model

Tasks are stored in the `todos` collection with this shape:

```ts
interface TodoDocument {
  _id: ObjectId
  userId: string
  title: string
  completed: boolean
  emoji?: string
  content: ContentBlock[]
  createdAt: Date
  updatedAt: Date
  priority?: "low" | "medium" | "high"
  order: number
}
```

The `order` field keeps drag-and-drop stable across devices. All timestamps are ISO strings on the client.

## 5. API routes

All API handlers live under `app/api/todos` and require a valid Clerk session. They use `auth()` from `@clerk/nextjs/server` to grab the `userId` and scope queries.

- `GET /api/todos` — returns the authenticated user's tasks sorted by `order`.
- `POST /api/todos` — creates a new task (defaults to the 📝 emoji and appends to the list).
- `PATCH /api/todos/:id` — updates specific fields (title, completed, emoji, priority, content, order).
- `DELETE /api/todos/:id` — removes a task.
- `PATCH /api/todos/reorder` — accepts an array of `{ id, order }` pairs to persist drag-and-drop changes.

Every response serialises MongoDB's `_id` to a string so it matches the shared `Todo` TypeScript interface.

## 6. Frontend integration

`components/todo-app.tsx` calls the API routes and manages optimistic updates:

- Loads tasks on mount and shows a skeleton while waiting.
- Applies optimistic UI changes for toggles, edits, deletes, and reorder operations.
- Rolls back state and surfaces a helpful error banner if a request fails.
- Keeps the detail drawer (`TodoDetail`) in sync by mirroring updates to `selectedTodo`.

`components/login/login-form.tsx` and the new `/sign-up` route render Clerk's hosted components with the same visual language as the original mock-up.

## 7. Middleware & routing

Instead of a global middleware, individual pages enforce auth using `auth()`:

- `/` redirects unauthenticated visitors to `/login`.
- `/login` and `/sign-up` redirect signed-in users back to `/`.
- The root layout wraps everything in `ClerkProvider`, picking up the publishable key from the environment.

## 8. Local development workflow

1. Install dependencies with `pnpm install`.
2. Start the dev server with `pnpm dev`.
3. Sign up for a new account via `/sign-up` (Clerk handles email verification flows automatically).
4. Add tasks — they persist to MongoDB immediately.

## 9. Deployment checklist

- Ensure the production environment (Vercel, Netlify, etc.) has the same environment variables as `.env.local`.
- Allow your hosting provider to connect to MongoDB (IP whitelist for Atlas).
- Provision the Clerk domain in production and set the appropriate redirect URLs.
- Run a smoke test (`pnpm build`) to catch type or runtime errors before pushing.

With these steps in place the to-do list is multi-device ready, secure, and fully persistent.
