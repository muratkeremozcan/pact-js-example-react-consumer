// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components'

export const AppContainer = styled.div`
  text-align: center;
  padding: 20px;
`

export const Title = styled.h1`
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 20px;
`

export const MovieList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 0 auto 20px;
`

export const MovieItem = styled.li`
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const Button = styled.button`
  background-color: #ff6347;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e5533d;
  }

  &:disabled {
    background-color: #ddd;
    cursor: not-allowed;
  }
`

export const Input = styled.input`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;

  &[type='number'] {
    width: 100px;
  }
`

export const Subtitle = styled.h2`
  color: #333;
  font-size: 2rem;
  margin-bottom: 10px;
`
