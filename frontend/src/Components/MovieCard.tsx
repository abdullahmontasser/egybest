import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../css/MovieCard.css';
import Movie from '../MovieModel';
import * as profileService from '../services/profileService';
import { useAuth } from '../contexts/AuthContext';

interface MovieCardProps {
  movie: {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
    url: string;
    overview: string;
  };
}

function MovieCard({ movie }: MovieCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const navigate = useNavigate(); // Get navigate function

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      setIsLoading(true);
      // Always check localStorage first for immediate UI feedback (optional but can feel faster)
      const localFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      const isFavInLocal = localFavorites.some((fav: Movie) => fav.id === movie.id);

      if (isAuthenticated) {
        try {
          // Fetch profile data which includes favorites
          const profileResponse = await profileService.getProfile();
          let isFavInDb = false;
          // Check if the fetch was successful and data exists
          if (profileResponse.success && profileResponse.data) {
            // Check if the movie exists in the profile's favoriteMovies array
            isFavInDb = profileResponse.data.favoriteMovies?.some(
              (fav: { movieId: string }) => fav.movieId === movie.id.toString()
            );
          }
          // Set favorite status based on DB check, otherwise it remains false (or could fallback differently)
          setIsFavorite(isFavInDb);
        } catch (error) {
          console.error('Error fetching profile for favorite status:', error);
          // Fallback to localStorage status if API fails
          setIsFavorite(isFavInLocal);
        }
      } else {
        // Not authenticated, rely solely on localStorage
        setIsFavorite(isFavInLocal);
      }
      setIsLoading(false);
    };

    checkFavoriteStatus();
  }, [movie.id, isAuthenticated]); // Add isAuthenticated as a dependency

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return; // Prevent clicks while loading initial state

    // Determine the next state *before* updating UI state
    const nextIsFavorite = !isFavorite;

    // Redirect to login if not authenticated and trying to add favorite
    if (!isAuthenticated && nextIsFavorite) {
      navigate('/login');
      return;
    }

    // Update local state immediately for UI responsiveness
    setIsFavorite(nextIsFavorite);

    // Update localStorage for non-authenticated users and UI consistency
    // Note: This part is now only relevant for *removing* favorites when not logged in,
    // as adding favorites redirects to login.
    let updatedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (nextIsFavorite) {
      // Add to localStorage (This block might be less relevant now for adding, but kept for structure)
      const movieToAdd = { ...movie };
      if (!updatedFavorites.some((fav: Movie) => fav.id === movie.id)) {
        updatedFavorites.push(movieToAdd);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      }

      // If authenticated, also add to database
      if (isAuthenticated) { // This check is technically redundant due to the redirect, but safe to keep
        setIsLoading(true); // Indicate API call in progress
        try {
          await profileService.addToFavorites({
            movieId: movie.id.toString(),
            title: movie.title,
            poster: movie.url
          });
        } catch (error) {
          console.error('Error adding to favorites:', error);
          // Revert UI state on error
          setIsFavorite(false);
          // Also revert localStorage change if needed
          const revertedFavorites = updatedFavorites.filter((fav: Movie) => fav.id !== movie.id);
          localStorage.setItem('favorites', JSON.stringify(revertedFavorites));
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // Remove from localStorage
      updatedFavorites = updatedFavorites.filter((fav: Movie) => fav.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));

      // If authenticated, also remove from database
      if (isAuthenticated) {
        setIsLoading(true); // Indicate API call in progress
        try {
          await profileService.removeFromFavorites(movie.id.toString());
        } catch (error) {
          console.error('Error removing from favorites:', error);
          // Revert UI state on error
          setIsFavorite(true);
          // Also revert localStorage change if needed
          const movieToAdd = { ...movie };
          if (!updatedFavorites.some((fav: Movie) => fav.id === movie.id)) {
             updatedFavorites.push(movieToAdd);
             localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
          }
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <div className="movie-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Link to={`/movie/${movie.id}`} className="movie-poster">
        <img src={movie.url} alt={movie.title} loading="lazy" />
        <div className={`movie-overlay ${isHovered ? 'visible' : ''}`}>
          <div className="movie-details-overlay">
            <h3>{movie.title}</h3>
            <div className="movie-meta">
              <span className="release-year">{new Date(movie.release_date).getFullYear()}</span>
              <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
            </div>
            <p className="overview">{movie.overview}</p>
          </div>
        </div>
      </Link>
      <button
        className={`favorite-button ${isFavorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`} // Add loading class
        onClick={toggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        disabled={isLoading} // Disable button while loading
      >
        <svg
          className="heart-icon"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
      <Link to={`/movie/${movie.id}`} className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="release-year">{new Date(movie.release_date).getFullYear()}</span>
          <span className="rating">⭐ {movie.vote_average.toFixed(1)}</span>
        </div>
      </Link>
    </div>
  );
}

export default MovieCard;
