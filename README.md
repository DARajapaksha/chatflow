# chatFlow

chatFlow is a real-time web chat application. It uses Clerk for authentication, MongoDB for users and messages, Socket.IO for online presence and message events, and ImageKit for optional image and video uploads.

## Features

- Clerk sign-in and sign-up
- User directory and conversation sidebar
- Real-time online-user presence
- Direct messages with text, images, and videos
- Searchable user and conversation lists
- Theme presets, dark mode, and wallpaper selection
- Responsive desktop and mobile chat layouts
- Single Docker image for the frontend and backend

## Project Structure

```text
chatflow/
├── backend/
│   ├── src/
│   │   ├── controllers/       Request handlers
│   │   ├── lib/               Database, Socket.IO, ImageKit, and cron setup
│   │   ├── middleware/        Authentication and upload middleware
│   │   ├── models/            Mongoose models
│   │   ├── routes/            API routes
│   │   └── webhooks/          Clerk user synchronization
│   └── package.json
├── frontend/
│   ├── public/                Static wallpapers, sounds, and logo assets
│   ├── src/
│   │   ├── components/        Reusable UI and chat components
│   │   ├── context/           Theme and wallpaper providers
│   │   ├── pages/             Authentication and chat pages
│   │   └── store/             Zustand auth and chat state
│   └── package.json
├── Dockerfile
└── README.md
```

## Requirements

- Node.js 22 or newer
- npm
- MongoDB database
- Clerk application
- Docker, if deploying with the included Dockerfile
- ImageKit account, only if media uploads are needed

## Local Development

### 1. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/chatflow
FRONTEND_URL=http://localhost:5173
CLERK_WEBHOOK_SIGNING_SECRET=whsec_your_clerk_webhook_secret
IMAGE_KIT_PRIVATE_KEY=your_imagekit_private_key
```

`CLERK_WEBHOOK_SIGNING_SECRET` is required for Clerk user synchronization. `IMAGE_KIT_PRIVATE_KEY` can be omitted when media uploads are not used.

### 3. Configure the frontend

Create `frontend/.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
```

The development frontend calls the backend at `http://localhost:3000/api`.

### 4. Start both applications

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173`.

## Clerk Configuration

Create a Clerk application and configure the frontend publishable key and backend webhook:

1. Add `VITE_CLERK_PUBLISHABLE_KEY` to the frontend environment.
2. Add the backend `CLERK_WEBHOOK_SIGNING_SECRET` to the backend environment.
3. Create a Clerk webhook pointing to:

```text
https://your-domain.example.com/api/webhooks/clerk
```

4. Subscribe to `user.created`, `user.updated`, and `user.deleted`.

The webhook creates or updates the MongoDB user record. The protected API uses the Clerk user ID to find that record.

## API Routes

All protected routes require a valid Clerk session.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `GET` | `/api/auth/check` | Return the authenticated user |
| `GET` | `/api/messages/users` | List users except the signed-in user |
| `GET` | `/api/messages/conversations` | List existing conversation partners |
| `GET` | `/api/messages/:id` | Get messages with a user |
| `POST` | `/api/messages/send/:id` | Send a text or media message |
| `POST` | `/api/webhooks/clerk` | Synchronize Clerk users |

## Production Docker Build

The Dockerfile builds the frontend, copies the backend source into a production `dist` directory, and serves the frontend from the backend server.

Build the image from the repository root:

```bash
docker build \
  --build-arg VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key \
  -t chatflow .
```

Run it:

```bash
docker run --rm -p 3001:3001 \
  -e PORT=3001 \
  -e MONGO_URI="your_mongodb_connection_string" \
  -e FRONTEND_URL="https://your-domain.example.com" \
  -e CLERK_WEBHOOK_SIGNING_SECRET="your_webhook_secret" \
  -e IMAGE_KIT_PRIVATE_KEY="your_imagekit_private_key" \
  chatflow
```

The production server listens on port `3001` by default and serves both the SPA and `/api` routes.

## Useful Commands

### Frontend

```bash
cd frontend
npm run dev       # Start Vite development server
npm run build     # Create production frontend assets
npm run lint      # Run ESLint
npm run preview   # Preview the production frontend build
```

### Backend

```bash
cd backend
npm run dev       # Start with Nodemon
npm start         # Start the backend
```

The backend build script uses Unix commands and is intended for the Linux Docker build. On Windows, use `node --check` for a syntax check or run the Docker build to validate the production build.

## Troubleshooting

- **The app stays on the loading screen:** verify that `/api/auth/check` responds and that the signed-in Clerk user has a matching MongoDB record.
- **No users appear:** verify `MONGO_URI`, confirm the Clerk webhook is configured, and check that the production database contains real user records. Remove old development records directly in MongoDB if needed.
- **Media uploads fail:** set `IMAGE_KIT_PRIVATE_KEY` and verify the ImageKit account configuration.
- **CORS errors locally:** set `FRONTEND_URL=http://localhost:5173` in the backend environment.
- **Docker cannot resolve frontend dependencies:** install without `--legacy-peer-deps` so HeroUI peer dependencies are installed.

## License

No license has been specified for this project.
