import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../css/MovieCard.css';
import Movie from '../MovieModel';

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

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setIsFavorite(favorites.some((fav: Movie) => fav.id === movie.id));
  }, [movie.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');

    if (isFavorite) {
      const newFavorites = favorites.filter((fav: Movie) => fav.id !== movie.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(movie);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);
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
        className={`favorite-button ${isFavorite ? 'active' : ''}`}
        onClick={toggleFavorite}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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
