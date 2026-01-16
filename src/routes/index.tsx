import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold">Hello World!</h1>
      <p>This is a blank skeleton app.</p>
    </div>
  )
}
