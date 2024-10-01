import {SInput} from '@styles/styled-components'

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
