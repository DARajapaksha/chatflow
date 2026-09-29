# chatFlow

chatFlow is a real-time chat application built with React on the frontend and an Express + MongoDB API on the backend. It uses Clerk for authentication, Socket.IO for live updates, and optional ImageKit media uploads for images and videos.

## Overview

The app includes:

- Clerk-powered sign in and sign up
- A conversation sidebar with user discovery
- Real-time online presence and message delivery
- Direct messaging with text, images, and video support
- Theme presets, dark mode, and wallpaper selection
- A production-ready Docker build that serves both the frontend and the API from a single container

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, HeroUI, Zustand
- Backend: Node.js, Express, Mongoose, Socket.IO
- Authentication: Clerk
- Storage: MongoDB
- Media uploads: ImageKit
- Deployment: Docker

## Project Structure

```text
chatflow/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── webhooks/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
├── Dockerfile
├── README.md
└── package-lock.json
```

## Requirements

- Node.js 22+
- npm
- MongoDB instance
- Clerk app and webhook secret
- ImageKit credentials for media uploads (optional but recommended)
- Docker for containerized deployment

## Local Development Setup

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure environment variables

Create a backend `.env` file in `backend/`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/chatflow
FRONTEND_URL=http://localhost:5173
CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_clerk_webhook_secret
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
```

Create a frontend `.env` file in `frontend/`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

Notes:

- `CLERK_WEBHOOK_SIGNING_SECRET` is required for user sync via Clerk webhooks.
- `IMAGE_KIT_PRIVATE_KEY` is optional if you do not use media uploading.
- The frontend API base URL is configured in `frontend/src/lib/axios.js` to use `http://localhost:3000/api` in development.

### 3. Start the app

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

## Clerk Setup

To use authentication correctly:

1. Create a Clerk app in the Clerk dashboard.
2. Copy the frontend publishable key into `frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY`.
3. Add the backend webhook secret to `backend/.env` as `CLERK_WEBHOOK_SIGNING_SECRET`.
4. Configure a Clerk webhook for:

```text
https://your-domain.example.com/api/webhooks/clerk
```

5. Subscribe to these events:
   - `user.created`
   - `user.updated`
   - `user.deleted`

This webhook syncs Clerk users into MongoDB so the API can find the authenticated user record.

## API Routes

The backend exposes the following routes under `/api`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/api/auth/check` | Validates the authenticated Clerk user |
| `GET` | `/api/messages/users` | Lists users except the current user |
| `GET` | `/api/messages/conversations` | Lists conversation partners |
| `GET` | `/api/messages/:id` | Fetches messages with a specific user |
| `POST` | `/api/messages/send/:id` | Sends a text or media message |
| `POST` | `/api/webhooks/clerk` | Syncs Clerk user events |

## Docker Deployment

The repository includes a Dockerfile that builds the React app and serves it through the Express backend in production.

Build from the repository root:

```bash
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key \
  -t chatflow .
```

Run the container:

```bash
docker run --rm -p 3001:3001 \
  -e PORT=3001 \
  -e MONGO_URI="mongodb://your_mongodb_uri" \
  -e FRONTEND_URL="https://your-domain.example.com" \
  -e CLERK_WEBHOOK_SIGNING_SECRET="your_webhook_secret" \
  -e IMAGE_KIT_PRIVATE_KEY="your_imagekit_private_key" \
  chatflow
```

The production server listens on port `3001` and serves both the built frontend and the API routes.

## Useful Commands

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
npm run preview
```

### Backend

```bash
cd backend
npm run dev
npm start
```

## Troubleshooting

- If the app stays stuck on the loading screen, verify that `/api/auth/check` returns a valid authenticated user and that the Clerk user exists in MongoDB.
- If no users appear, confirm `MONGO_URI` and make sure the Clerk webhook is configured correctly.
- If media uploads fail, verify the ImageKit private key and account configuration.
- If local requests fail due to CORS, make sure `FRONTEND_URL=http://localhost:5173` is set in the backend environment.
- If Docker fails during install, run dependency installation without forcing legacy peer resolution unless the lockfile specifically requires it.

## License

No license has been specified for this project.
