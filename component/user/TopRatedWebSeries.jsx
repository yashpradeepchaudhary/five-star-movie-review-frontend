import React, { useEffect, useState } from "react";
import GridContainer from "../GridContainer";
import { useNotification } from "../../hooks";
import { getTopRatedMovies } from "../../api/movie";
import MovieList from "./MovieList";

// export default function TopRatedWebSeries() {
//   const [movies, setMovies] = useState([]);
//   const { updateNotification } = useNotification();

//   const fetchMovies = async (signal) => {
//     const { error, movies } = await getTopRatedMovies('Web Series',signal);
//     if (error) return updateNotification("error", error);

//     setMovies([...movies]);
//   };



//   useEffect(() => {
//     const ac = new AbortController();
//     fetchMovies(ac.signal);
//     return () => {
//       ac.abort()
//     }
//   }, []);

//   return <MovieList movies={movies} title='Viewers choice (Web Series)' />

   
// }


export default function TopRatedWebSeries() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies("Web Series", signal);
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };

  useEffect(() => {
    const ac = new AbortController();
    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    };
  }, []);

  return <MovieList movies={movies} title="Viewers choice (Web Series)" />;
}

