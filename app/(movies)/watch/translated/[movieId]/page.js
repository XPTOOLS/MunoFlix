import { getTranslatedMovieById } from "@/data/translated-movies";
import TranslatedMoviePlayer from "@/content/watch/TranslatedMoviePlayer/TranslatedMoviePlayer";
import MovieNotFound from "@/components/errors/MovieNotFound";

const TranslatedWatchPage = async ({ params }) => {
  const { movieId } = params; // Changed from id to movieId
  
  const movie = getTranslatedMovieById(movieId);

  if (!movie) {
    return <MovieNotFound />;
  }

  return <TranslatedMoviePlayer movie={movie} />;
};

export default TranslatedWatchPage;