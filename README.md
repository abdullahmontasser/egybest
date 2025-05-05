# EgyBest - Movie Discovery Platform

A modern, responsive web application for discovering and exploring movies. Built with React, TypeScript, and Vite.

![EgyBest Screenshot](./public/screenshot.png)

## 🎬 Features

- **Movie Discovery**: Browse popular movies with infinite scroll
- **Search**: Real-time movie search with debouncing
- **Genre Filtering**: Filter movies by different genres
- **Favorites**: Save and manage your favorite movies
- **Responsive Design**: Optimized for both desktop and mobile
- **Theme Toggle**: Switch between light and dark themes
- **Movie Details**:
  - Watch trailers
  - View cast information
  - See ratings and release dates
  - Read plot summaries

## 🛠️ Tech Stack

- React 19
- TypeScript
- Vite
- React Router v7
- Framer Motion
- TMDB API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm/yarn
- TMDB API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/abdullahmontasser/egybest.git
cd egybest
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory
```env
VITE_TMDB_API_KEY=your_api_key_here
```

4. Start the development server
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

```bash
npm run deploy
```

### Railway Deployment

This project is configured for deployment on Railway. To deploy:

1.  Push your code to a GitHub repository.
2.  Connect your GitHub repository to Railway.
3.  Railway will automatically detect the `railway.json` file and build/deploy the frontend and backend services.
4.  Ensure you configure the necessary environment variables in Railway, especially `MONGODB_URI` and `JWT_SECRET` for the backend service. You can use Railway's managed MongoDB service or connect to an external one.

## 🌐 Live Demo

Visit the live site: [EgyBest](https://abdullahmontasser.github.io/egybest)

## 📱 Screenshots

### Desktop View
![Desktop View](./public/desktop.png)

### Mobile View
![Mobile View](./public/mobile.png)

## 🔑 Key Features

### Movie Discovery
- Infinite scroll for seamless browsing
- Cached responses for better performance
- Loading animations and error handling

### Search & Filter
- Real-time search with debouncing
- Genre-based filtering
- Combined search and filter functionality

### Movie Details
- High-quality backdrop images
- Embedded YouTube trailers
- Cast information with photos
- Comprehensive movie information

### User Experience
- Responsive design
- Dark/Light theme
- Smooth animations
- Favorite movies management

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for their comprehensive movie database API
- [React](https://reactjs.org/) for the excellent UI library
- [Vite](https://vitejs.dev/) for the fast build tooling
