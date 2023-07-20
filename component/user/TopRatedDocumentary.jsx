import React, { useEffect, useState } from 'react'
import { useNotification } from '../../hooks';
import { getTopRatedMovies } from '../../api/movie';
import MovieList from './MovieList';

export default function TopRatedDocumentary() {
    const [movies, setMovies] = useState([]);
    const { updateNotification } = useNotification();
  
    const fetchMovies = async (signal) => {
      const { error, movies } = await getTopRatedMovies('Documentary',signal);
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
  
    return <MovieList movies={movies} title='Viewers choice (Documentary)' />
  
     
}
