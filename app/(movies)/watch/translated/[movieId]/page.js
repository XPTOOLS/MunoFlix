import { getTranslatedMovieById, getAllTranslatedMovies } from "@/data/translated-movies";
import TranslatedMoviePlayer from "@/content/watch/TranslatedMoviePlayer/TranslatedMoviePlayer";
import MovieNotFound from "@/components/errors/MovieNotFound";

const TranslatedWatchPage = async ({ params }) => {
  const { movieId } = params;
  
  // Try both with and without prefix to handle all cases
  let movie = getTranslatedMovieById(movieId);
  
  if (!movie && movieId.startsWith('translated-')) {
    // If not found and has prefix, try without prefix (backward compatibility)
    const actualMovieId = movieId.replace('translated-', '');
    movie = getTranslatedMovieById(actualMovieId);
  } else if (!movie && !movieId.startsWith('translated-')) {
    // If not found and no prefix, try with prefix
    const prefixedMovieId = `translated-${movieId}`;
    movie = getTranslatedMovieById(prefixedMovieId);
  }

  if (!movie) {
    console.log(`Movie not found: ${movieId}`);
    console.log('Available movies:', getAllTranslatedMovies().map(m => m.id));
    return <MovieNotFound />;
  }

  return <TranslatedMoviePlayer movie={movie} />;
};

export default TranslatedWatchPage;
