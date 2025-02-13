import { useState, useEffect } from 'react';
import MovieCard from '../Components/MovieCard';
import Movie from '../MovieModel';
import '../css/Favorites.css';

function Favorites() {
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      setIsLoading(true);
      try {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(storedFavorites);
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();

    // Add event listener for storage changes
    window.addEventListener('storage', loadFavorites);

    return () => {
      window.removeEventListener('storage', loadFavorites);
    };
  }, []);

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
