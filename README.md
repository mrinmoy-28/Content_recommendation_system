# StreamAI - Smart Content Recommendations

StreamAI is an AI-driven streaming platform that delivers personalized content recommendations to users based on their viewing history, preferences, and behavior. This project demonstrates a full-stack application with React frontend and Node.js backend.

## Features

- **User Authentication**: Sign up, login, and profile management
- **Personalized Recommendations**: AI-powered recommendations based on user viewing history and preferences
- **Content Discovery**: Browse and filter content by genre, type, and more
- **Content Details**: View detailed information about movies and TV shows
- **Continue Watching**: Track viewing progress and continue where you left off
- **Search Functionality**: Find specific content across the platform
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Tech Stack

### Frontend
- React with TypeScript
- React Router for navigation
- Jotai for state management
- Tailwind CSS for styling
- Lucide React for icons
- Axios for API requests

### Backend
- Express.js for the API server
- JSON Server for rapid prototyping
- JWT for authentication
- LowDB for local database storage
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/stream-ai-recommendations.git
cd stream-ai-recommendations
```

2. Install dependencies:
```bash
npm install
```

3. Seed the database:
```bash
node server/seed.js
```

4. Start the development server:
```bash
# Start the backend server
npm run server

# In a new terminal, start the frontend development server
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Demo Account
- Email: demo@example.com
- Password: password123

## Project Structure

```
stream-ai-recommendations/
├── public/                  # Static assets
├── server/                  # Backend server code
│   ├── index.js             # Express server setup
│   ├── db.json              # Database file
│   └── seed.js              # Database seeding script
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication related components
│   │   ├── layout/          # Layout components
│   │   ├── sections/        # Page section components
│   │   └── ui/              # Basic UI components
│   ├── pages/               # Page components
│   ├── store/               # State management
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main application component
│   └── main.tsx             # Entry point
├── .gitignore
├── package.json
├── README.md
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login a user
- `GET /auth/me` - Get current user info

### Content
- `GET /content` - Get all content
- `GET /content/:id` - Get content details
- `GET /content?genre=:genreId` - Filter content by genre
- `GET /content?q=:query` - Search content

### Genres
- `GET /genres` - Get all genres

### Viewing History
- `GET /history?userId=:userId` - Get user's viewing history
- `POST /history` - Add to viewing history
- `PATCH /history/:id` - Update viewing history

### Recommendations
- `GET /recommendations?userId=:userId` - Get user recommendations
- `GET /recommendations/similar/:contentId` - Get similar content
- `POST /recommendations/refresh/:userId` - Refresh user recommendations

## Testing

Run the tests with:

```bash
npm run test
```

## Roadmap

- [ ] Social features (sharing, comments, reviews)
- [ ] Advanced AI recommendation engine
- [ ] Interactive content rating system
- [ ] Multiple user profiles
- [ ] Watchlist and custom collections
- [ ] Content categorization based on mood and themes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Stock images from [Pexels](https://www.pexels.com/)
- Icons from [Lucide](https://lucide.dev/)