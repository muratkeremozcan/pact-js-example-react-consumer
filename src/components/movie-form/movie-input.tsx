import {SInput} from '@styles/styled-components'

type MovieInputProps = Readonly<{
  type: 'text' | 'number'
  value: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
}>

export default function MovieInput({
  type,
  value,
  placeholder,
  onChange,
}: MovieInputProps) {
  return (
    <SInput
      data-cy={`movie-input-comp-${type}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  )
}
