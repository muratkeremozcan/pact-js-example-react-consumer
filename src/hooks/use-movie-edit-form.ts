import {useState} from 'react'
import {useUpdateMovie} from '@hooks/use-movies'
import {UpdateMovieSchema} from '@provider-schema/schema'
import type {ZodError} from 'zod'
import type {Movie} from 'src/consumer'

export function useMovieEditForm(initialMovie: Movie) {
  const [movieName, setMovieName] = useState(initialMovie.name)
  const [movieYear, setMovieYear] = useState(initialMovie.year)
  const [validationError, setValidationError] = useState<ZodError | null>(null)

  const {status, mutate} = useUpdateMovie()
  const movieLoading = status === 'pending'

  // Zod Key feature 3: safeParse
  // Zod note: if you have a frontend, you can use the schema + safeParse there
  // in order to perform form validation before sending the data to the server

  const handleUpdateMovie = () => {
    const result = UpdateMovieSchema.safeParse({
      name: movieName,
      year: movieYear,
    })

    // Zod key feature 4: you can utilize
    // and expose the validation state to be used at a component
    if (!result.success) {
      setValidationError(result.error)
      return
    }

    mutate({id: initialMovie.id, name: movieName, year: movieYear})
    setValidationError(null)
  }

  return {
    movieName,
    movieYear,
    setMovieName,
    setMovieYear,
    handleUpdateMovie,
    movieLoading,
    validationError,
  }
}
