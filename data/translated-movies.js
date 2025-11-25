export const translatedMovies = [
  {
    id: "translated-crood-1",
    title: "CROOD 1 - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/4BgSWIFMWCyXmuxj8iCWdQcVRAs.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/4BgSWIFMWCyXmuxj8iCWdQcVRAs.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/CROOD%201.mp4",
    description: "The Croods is a prehistoric comedy adventure that follows the world's first family as they embark on a journey of a lifetime when the cave that has always shielded them from danger is destroyed.",
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    year: "2013",
    duration: "98 min",
    vote_average: 7.2,
    media_type: "movie",
    original_language: "en",
    adult: false
  },
  {
    id: "translated-crood-2", 
    title: "CROOD 2 - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/tbVZ3Sq88dZaCANlUcewQuHQOaE.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/tbVZ3Sq88dZaCANlUcewQuHQOaE.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/CROOD%202.mp4",
    description: "The Croods have survived their fair share of dangers and disasters, but now they face their biggest challenge yet: another family.",
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    year: "2020",
    duration: "95 min",
    vote_average: 7.0,
    media_type: "movie",
    original_language: "en",
    adult: false
  },
  {
    id: "translated-movie-3",
    title: "Frozen - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/kgwjIb2JDHRhNk13lmSxiClFj0k.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/kgwjIb2JDHRhNk13lmSxiClFj0k.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/FROZEN.mp4",
    description: "Young princess Anna of Arendelle dreams about finding true love at her sister Elsa's coronation. Fate takes her on a dangerous journey in an attempt to end a perpetual winter.",
    genre: ["Animation", "Adventure", "Family"],
    year: "2013",
    duration: "102 min",
    vote_average: 7.3,
    media_type: "movie",
    original_language: "en",
    adult: false
  },
  {
    id: "translated-movie-4",
    title: "Toy Story - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/TOY_STORY.mp4",
    description: "Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz.",
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    year: "1995",
    duration: "81 min",
    vote_average: 8.0,
    media_type: "movie",
    original_language: "en",
    adult: false
  },
  {
    id: "translated-movie-5",
    title: "Finding Nemo - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/eHuGQ10FUzK1mdOY69wF5pGgEf5.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/FINDING_NEMO.mp4",
    description: "Nemo, an adventurous young clownfish, is unexpectedly taken from his Great Barrier Reef home to a dentist's office aquarium. It's up to his worrisome father Marlin to find him.",
    genre: ["Animation", "Adventure", "Comedy", "Family"],
    year: "2003",
    duration: "100 min",
    vote_average: 7.8,
    media_type: "movie",
    original_language: "en",
    adult: false
  },
  {
    id: "translated-movie-6",
    title: "The Lion King - Luganda",
    poster: "https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg", // Example poster
    backdrop: "https://image.tmdb.org/t/p/w780/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg",
    videoUrl: "https://namzentertainments.xyz/projects/9%20oct/LION_KING.mp4",
    description: "A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows up beyond the Savannah.",
    genre: ["Animation", "Adventure", "Drama", "Family", "Musical"],
    year: "1994",
    duration: "88 min",
    vote_average: 8.3,
    media_type: "movie",
    original_language: "en",
    adult: false
  }
];

// Helper function to get movie by ID
export const getTranslatedMovieById = (id) => {
  return translatedMovies.find(movie => movie.id === id);
};

// Helper function to get all movies
export const getAllTranslatedMovies = () => {
  return translatedMovies;
};