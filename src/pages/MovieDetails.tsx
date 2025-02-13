import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../css/MovieDetails.css';
import { getMovieDetails, type MovieDetails as MovieDetailType } from '../services/api';
import LoadingSpinner from '../Components/LoadingSpinner';

function MovieDetails() {
    const { id } = useParams();
    const [movie, setMovie] = useState<MovieDetailType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const data = await getMovieDetails(parseInt(id));
                setMovie(data);
            } catch (err) {
                console.error('Error fetching movie:', err);
                setError(err instanceof Error ? err.message : 'An error occurred while fetching movie details');
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [id]);

    if (loading) return <div className="loading"><LoadingSpinner /></div>;
    if (error) return <div className="error">{error}</div>;
    if (!movie) return <div className="error">Movie not found</div>;

    const trailers = movie.videos?.results.filter(video => video.type === "Trailer") || [];
    const cast = movie.credits?.cast || [];

    return (
        <div className="movie-details">
            <div
                className="movie-hero"
                style={{
                    backgroundImage: movie.backdrop_path
                        ? `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
                        : 'none'
                }}
            >
                <div className="hero-content">
                    <h1>{movie.title}</h1>
                    <div className="movie-meta">
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                        <span>{movie.runtime} min</span>
                    </div>
                </div>
            </div>

            <div className="movie-content">
                <section className="overview">
                    <h2>Overview</h2>
                    <p>{movie.overview}</p>
                </section>

                {trailers.length > 0 && (
                    <section className="trailers">
                        <h2>Trailers</h2>
                        <div className="trailer-grid">
                            {trailers.slice(0, 2).map(trailer => (
                                <div key={trailer.id} className="trailer-wrapper">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title={trailer.name}
                                        allowFullScreen
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {cast.length > 0 && (
                    <section className="cast">
                        <h2>Cast</h2>
                        <div className="cast-grid">
                            {cast.slice(0, 6).map(actor => (
                                <div key={actor.id} className="cast-card">
                                    <div className="cast-image">
                                        <img
                                            src={actor.profile_path
                                                ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
                                                : '/placeholder-person.jpg'
                                            }
                                            alt={actor.name}
                                        />
                                    </div>
                                    <div className="cast-info">
                                        <h3>{actor.name}</h3>
                                        <p>{actor.character}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

export default MovieDetails;
