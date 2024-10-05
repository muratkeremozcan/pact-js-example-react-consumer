import {Link} from 'react-router-dom'
import {SButton} from '@styles/styled-components'
import styled from 'styled-components'

type MovieItemProps = Readonly<{
  id: number
  name: string
  year: number
  onDelete: (id: number) => void
}>

export default function MovieItem({id, name, year, onDelete}: MovieItemProps) {
  return (
    <SMovieItem data-cy="movie-item-comp">
      <Link to={`/movies/${id}`} data-cy={`link-${id}`}>
        {name} ({year})
      </Link>
      <SButton data-cy={`delete-movie-${name}`} onClick={() => onDelete(id)}>
        Delete
      </SButton>
    </SMovieItem>
  )
}

const SMovieItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`