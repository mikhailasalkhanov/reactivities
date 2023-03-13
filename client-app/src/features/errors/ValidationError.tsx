import { Message } from 'semantic-ui-react'

interface Props {
  errors: any
}

export default function ValidationError ({ errors }: Props) {
  return (
    <Message error>
      {errors && (
        <Message.List>
          {errors.map((e: string, i: any) => (
            <Message.Item key={i}>{e}</Message.Item>
          ))}
        </Message.List>
      )}
    </Message>
  )
}
