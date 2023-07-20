import React, { useEffect, useState } from "react";
import GridContainer from "../GridContainer";
import { useNotification } from "../../hooks";
import { getTopRatedMovies } from "../../api/movie";
import MovieList from "./MovieList";

export default function TopRatedMovies() {
  const [movies, setMovies] = useState([]);
  const { updateNotification } = useNotification();

  const fetchMovies = async (signal) => {
    const { error, movies } = await getTopRatedMovies(null,signal);
    if (error) return updateNotification("error", error);

    setMovies([...movies]);
  };



  useEffect(() => {
    const ac = new AbortController();
    // console.log(ac);
    fetchMovies(ac.signal);
    return () => {
      ac.abort();
    }
  }, []);

  return <MovieList movies={movies} title='Viewers choice (Movies)' />

   
}

// export default function TopRatedMovies() {
//   const [movies, setMovies] = useState([]);
//   const { updateNotification } = useNotification();

//   const fetchMovies = async () => {
//     const { error, movies } = await getTopRatedMovies();
//     if (error) return updateNotification("error", error);

//       console.log(movies)
//     setMovies([...movies]);
//   };

//   useEffect(() => {
//     fetchMovies();
//   }, []);

//   return (
//     <GridContainer>
        
//       {movies.map((_, index) => {
//           return <div className="p-5 bg-red-200" key={index}></div>;
//         })}
//     </GridContainer>
//   );
// }
