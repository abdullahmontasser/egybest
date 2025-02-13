// movie.model.ts
interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    backdrop_path: string | null;
    overview: string;
    vote_average: number;
    url: string;
    release: { date: string };
    genre_ids: number[];
}

export default Movie;
