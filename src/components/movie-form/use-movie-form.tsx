import {useAddMovie} from '@hooks/use-movies'
import {useState} from 'react'

export function useMovieForm() {
  const [movieName, setMovieName] = useState('')
  const [movieYear, setMovieYear] = useState(2023)

  const {status, mutate} = useAddMovie()
  const movieLoading = status === 'pending'

  const handleAddMovie = () => {
    mutate({name: movieName, year: movieYear})
    setMovieName('')
    setMovieYear(2023)
  }

  return {
    movieName,
    movieYear,
    setMovieName,
    setMovieYear,
    handleAddMovie,
    movieLoading,
  }
}
