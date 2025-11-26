import { getAllTranslatedMovies } from '@/data/translated-movies';

export const getMultiSearch = async (query, page, isadult) => {
  const url = `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=${isadult === true}&language=en-US&page=${page}&api_key=${process.env.TMDB_API_KEY}`;

  try {
    const res = await fetch(url,
      { next: { caches: "no-cache" } }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export const getSearch = async (query, page = 1, isAdult = false, type = 'movie') => {
  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    throw new Error('API key is missing.');
  }

  const url = `https://api.themoviedb.org/3/search/${type === "movies" ? "movie" : type}?query=${encodeURIComponent(query)}&include_adult=${isAdult}&language=en-US&page=${page}&api_key=${apiKey}`;


  try {
    const res = await fetch(url, { next: { caches: "no-cache" } });

    if (!res.ok) {
      throw new Error(`Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json(); // Store the result
    return data; // Return the stored result
  } catch (error) {
    console.error(`Failed to fetch search results: ${error.message}`);
    throw error;
  }
};

export const getCombinedSearch = async (query, page = 1, includeAdult = false) => {
  try {
    // Get TMDB search results
    const tmdbResults = await getMultiSearch(query, page, includeAdult);
    
    // Get translated movies that match the query
    const translatedMovies = getAllTranslatedMovies();
    const filteredTranslatedMovies = translatedMovies.filter(movie => 
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.original_title?.toLowerCase().includes(query.toLowerCase())
    );

    // Format translated movies to match TMDB structure
    const formattedTranslatedMovies = filteredTranslatedMovies.map(movie => ({
      ...movie,
      // Ensure it has all required fields for search results
      media_type: movie.media_type || 'movie',
      vote_average: movie.vote_average || 0,
      poster_path: movie.poster,
      backdrop_path: movie.backdrop,
      release_date: movie.year ? `${movie.year}-01-01` : null,
      first_air_date: null,
      genre_ids: movie.genre || [],
      adult: movie.adult || false,
      // Add a prefix to ID to distinguish from TMDB movies
      id: `translated-${movie.id}`,
      original_name: movie.title,
      name: movie.title,
      original_title: movie.title,
      title: movie.title
    }));

    // Combine and sort results
    const combinedResults = [
      ...(tmdbResults?.results || []),
      ...formattedTranslatedMovies
    ].sort((a, b) => b.vote_average - a.vote_average);

    return {
      ...tmdbResults,
      results: combinedResults,
      total_results: (tmdbResults?.total_results || 0) + formattedTranslatedMovies.length
    };

  } catch (error) {
    console.error('Error in combined search:', error);
    throw error;
  }
};
