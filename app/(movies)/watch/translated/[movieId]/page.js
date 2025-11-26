import { getTranslatedMovieById, getAllTranslatedMovies } from "@/data/translated-movies";
import TranslatedMoviePlayer from "@/content/watch/TranslatedMoviePlayer/TranslatedMoviePlayer";
import MovieNotFound from "@/components/errors/MovieNotFound";

const TranslatedWatchPage = async ({ params }) => {
  const { movieId } = params;
  
  // Remove the "translated-" prefix if it exists to get the actual movie ID
  const actualMovieId = movieId.startsWith('translated-') 
    ? movieId.replace('translated-', '') 
    : movieId;

  const movie = getTranslatedMovieById(actualMovieId);

  if (!movie) {
    console.log(`Movie not found: ${movieId}, actual ID: ${actualMovieId}`);
    console.log('Available movies:', getAllTranslatedMovies().map(m => m.id));
    return <MovieNotFound />;
  }

  return <TranslatedMoviePlayer movie={movie} />;
};

export default TranslatedWatchPage;
