import MovieCard from "../Components/MovieCard"
import { useState, useEffect, useCallback, useRef } from "react"
import "../css/Home.css"
import { getPopularMovies, searchMovies } from "../services/api";
import Movie from '../MovieModel'
import LoadingSpinner from '../Components/LoadingSpinner';
import { useLocation } from 'react-router-dom';

// Add the debounce function implementation
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

function Home() {
  const location = useLocation();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastMovieElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const debouncedSearchQuery = useDebounce(location.state?.searchQuery || '', 500);

  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  const fetchMovies = async (pageNumber: number, query: string = '') => {
    try {
      setLoading(true);
      setError(null);

      const data = query
        ? await searchMovies(query, pageNumber)
        : await getPopularMovies(pageNumber, selectedGenre);

      const mappedMovies = data.results.map(movie => ({
        ...movie,
        url: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : "/placeholder.jpg",
        release: { date: movie.release_date }
      }));

      setMovies(prev => pageNumber === 1 ? mappedMovies : [...prev, ...mappedMovies]);
      setHasMore(data.results.length > 0 && data.page < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching movies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const genre = location.state?.selectedGenre ?? null;
    setSelectedGenre(genre);
    setMovies([]);
    setPage(1);
    setHasMore(true);
  }, [location.state?.selectedGenre]);

  useEffect(() => {
    fetchMovies(page, debouncedSearchQuery);
  }, [page, debouncedSearchQuery, selectedGenre]);

  return (
    <div className="home-container">
      {error && <div className="error-message">{error}</div>}

      <div className="movies-grid">
        {movies.map((movie, index) => {
          if (movies.length === index + 1) {
            return (
              <div ref={lastMovieElementRef} key={movie.id}>
                <MovieCard movie={movie} />
              </div>
            );
          } else {
            return <MovieCard key={movie.id} movie={movie} />;
          }
        })}
      </div>

      {loading && <LoadingSpinner />}
      {!loading && !hasMore && <p className="end-message">No more movies to load.</p>}
    </div>
  );
}

export default Home;
