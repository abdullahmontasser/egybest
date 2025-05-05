import { useState, useEffect } from 'react';
import MovieCard from '../Components/MovieCard';
import Movie from '../MovieModel';
import '../css/Favorites.css';
import * as profileService from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const loadFavorites = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated) {
          // If user is authenticated, fetch favorites from API
          const response = await profileService.getFavorites();

          if (response.success && response.data) {
            // Convert API response to Movie format
            const apiFavorites = response.data.map((item: any) => ({
              id: parseInt(item.movieId),
              title: item.title,
              url: item.poster,
              // Add default values for required Movie properties
              poster_path: null,
              release_date: new Date().toISOString(),
              vote_average: 0,
              overview: ''
            }));
            setFavorites(apiFavorites);
          } else {
            // Fallback to localStorage if API fails
            const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            setFavorites(storedFavorites);
          }
        } else {
          // For non-authenticated users, use localStorage
          const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
          setFavorites(storedFavorites);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        // Fallback to localStorage on error
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Add event listener for storage changes (for non-authenticated users)
    window.addEventListener('storage', () => {
      if (!isAuthenticated) {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
      }
    });

    return () => {
      window.removeEventListener('storage', () => {});
    };
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="favorites-container">
        <div className="loading-spinner" role="status">
          <span>Loading favorites...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>My Favorite Movies</h1>

      {favorites.length === 0 ? (
        <div className="no-favorites">
          <p>You haven't added any movies to your favorites yet.</p>
          <p>Go to the home page and click the heart icon on movies you like!</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
