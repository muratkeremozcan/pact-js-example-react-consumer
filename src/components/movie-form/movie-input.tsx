import styled from 'styled-components'

type MovieInputProps = Readonly<{
  type: 'text' | 'number'
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeHolder: string
}>

export default function MovieInput({
  type,
  value,
  placeHolder,
  onChange,
}: MovieInputProps) {
  return (
    <SInput
      data-cy={`movie-input-comp-${type}`}
      type={type}
      placeholder={placeHolder}
      value={value}
      onChange={onChange}
    />
  )
}

const SInput = styled.input`
  padding: 10px;
  margin: 10px;
  border-radius: 5px;
  border: 1px solid #ddd;
  font-size: 1rem;

  &[type='number'] {
    width: 100px;
  }
`
