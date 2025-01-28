--------For Backend---------
# Spotify Playlist Manager - Backend

A Node.js backend server built with Express and MongoDB that provides API endpoints for the Spotify Playlist Manager application.

## Features

- User authentication with JWT
- RESTful API endpoints for playlist management
- MongoDB integration for data persistence
- Spotify API integration
- Error handling and validation
- Secure password hashing
- CORS support

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing
- Express Validator for input validation
- Spotify Web API Node

## Prerequisites

- Node.js (v16 or higher)
- MongoDB installed and running
- npm or yarn
- Spotify Developer account and API credentials

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd spotify-playlist-manager/backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the backend directory with your environment variables:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/spotify-playlist-manager
JWT_SECRET=your_jwt_secret_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
```

4. Start the server:
```bash
# Development mode
npm run dev
# or
yarn dev

# Production mode
npm start
# or
yarn start
```

The server will be running at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist by ID
- `POST /api/playlists` - Create new playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist

### Songs
- `POST /api/playlists/:id/songs` - Add song to playlist
- `PUT /api/playlists/:id/songs/:songId` - Update song in playlist
- `DELETE /api/playlists/:id/songs/:songId` - Remove song from playlist

### Spotify Integration
- `GET /api/spotify/search` - Search Spotify tracks
- `GET /api/spotify/recommendations` - Get track recommendations

## Project Structure

```
src/
├── config/            # Configuration files
├── controllers/       # Route controllers
├── middleware/        # Custom middleware
├── models/           # Mongoose models
├── routes/           # API routes
├── services/         # Business logic
├── utils/            # Utility functions
└── app.js            # Express app setup
```

## Error Handling

The API uses a consistent error response format:
```json
{
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details



-------For Front-End --------------
# Spotify Playlist Manager - Frontend

A modern web application built with React, TypeScript, and Material-UI that allows users to manage their Spotify playlists with enhanced features.

## Features

- User Authentication (Register/Login)
- Create, edit, and delete playlists
- Search Spotify tracks
- Add tracks to playlists
- Edit track information
- Modern, responsive UI with Material-UI
- Dark theme inspired by Spotify

## Tech Stack

- React 18
- TypeScript
- Vite
- Material-UI (MUI)
- Axios for API calls
- React Router for navigation

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)
- Spotify Developer account and API credentials

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd spotify-playlist-manager/frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the frontend directory with your environment variables:
```env
VITE_API_URL=http://localhost:3001
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/         # Reusable UI components
├── pages/             # Page components
├── services/          # API service functions
├── context/           # React context providers
├── types/             # TypeScript type definitions
├── utils/             # Utility functions
└── App.tsx            # Root component
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
