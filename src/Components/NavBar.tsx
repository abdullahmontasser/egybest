import '../css/Navbar.css'
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import icon from '../icons/icon.png'

interface Genre {
    id: number;
    name: string;
}

// interface NavBarProps {
//     onGenreSelect?: (genreId: number | null) => void;
// }

function NavBar() {
    const { theme, toggleTheme } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/genre/movie/list?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
                );
                const data = await response.json();
                setGenres(data.genres);
            } catch (error) {
                console.error('Error fetching genres:', error);
            }
        };

        fetchGenres();
    }, []);

    useEffect(() => {
        // Sync the selectedGenre state with the URL state when navigating
        const genre = location.state?.selectedGenre ?? null;
        setSelectedGenre(genre);
    }, [location.state?.selectedGenre]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Only navigate if we're not already on the home page
        if (location.pathname !== '/') {
            navigate('/', { state: { searchQuery: query } });
        } else {
            // If we're on the home page, just update the state
            navigate('.', {
                state: { searchQuery: query },
                replace: true // This prevents adding new entries to the history
            });
        }
    };

    const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? Number(e.target.value) : null;
        setSelectedGenre(value);

        // Only navigate if we're not already on the home page
        if (location.pathname !== '/') {
            navigate('/', { state: { selectedGenre: value } });
        } else {
            // If we're on the home page, just update the state
            navigate('.', {
                state: {
                    ...location.state,
                    selectedGenre: value
                },
                replace: true
            });
        }
    };

    return (
        <nav className="navbar">
            <div className="main-nav">
                <div className="navbar-brand">
                    <Link to="/" className="nav-link">
                        <img src={icon} alt="Site Logo" className="navbar-icon" />
                        <span>Egy best</span>
                    </Link>
                </div>

                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-input"
                    />
                </div>

                <div className="navbar-links">
                    <Link to="/" className="nav-link">Home</Link>
                    <Link to="/favorites" className="nav-link">Favorites</Link>
                    <div className="genre-filter">
                        <select
                            onChange={handleGenreChange}
                            value={selectedGenre || ''}
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        className="theme-toggle nav-link"
                        onClick={toggleTheme}
                        aria-label="Toggle theme"
                    >
                        {theme === 'dark' ? '🌙' : '☀️'}
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar
