import styled from 'styled-components'
import type {Movie} from 'src/consumer'

type MovieInfoProps = {
  movie: Movie
}

export default function MovieInfo({movie}: MovieInfoProps) {
  return (
    <SMovieInfo>
      <h2>{movie.name}</h2>
      <p>ID: {movie.id}</p>
      <p>Year: {movie.year}</p>
    </SMovieInfo>
  )
}

const SMovieInfo = styled.div`
  h2 {
    margin-top: 20px;
    color: #333;
    font-size: 24px;
  }
  p {
    font-size: 18px;
    color: #555;
  }
`
