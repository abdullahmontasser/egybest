interface Movie {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }

  interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  }

  export interface MovieDetails {
    id: number;
    title: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    overview: string;
    vote_average: number;
    genres: { id: number; name: string }[];
    runtime: number;
    credits: {
      cast: {
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
      }[];
      crew: {
        id: number;
        name: string;
        job: string;
      }[];
    };
    videos: {
      results: {
        id: string;
        key: string;
        name: string;
        type: string;
      }[];
    };
  }

  const API_KEY: string = import.meta.env.VITE_TMDB_API_KEY;
  const BASE_URL: string = "https://api.themoviedb.org/3";

  const cache = new Map()

  export const getPopularMovies = async (page: number = 1, genreId: number | null = null): Promise<MovieResponse> => {
    try {
      let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${page}`;

      if (genreId) {
        url += `&with_genres=${genreId}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.status_message ||
          `Failed to fetch popular movies. Status: ${response.status}`
        );
      }

      const data: MovieResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while fetching popular movies"
      );
    }
  };

  export const searchMovies = async (query: string, page: number = 1): Promise<MovieResponse> => {
    try {
      if (!query.trim()) {
        return {
          results: [],
          page: 1,
          total_pages: 0,
          total_results: 0
        };
      }

      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodedQuery}&page=${page}`
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.status_message ||
          `Failed to search movies. Status: ${response.status}`
        );
      }

      const data: MovieResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching movies:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while searching movies"
      );
    }
  };

  export const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
    const cacheKey = `movie-${movieId}`

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey)
    }

    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&language=en-US&append_to_response=credits,videos`
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details. Status: ${response.status}`);
    }

    const data = await response.json()
    cache.set(cacheKey, data)
    return data
  };
