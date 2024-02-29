import { createLazyFileRoute } from '@tanstack/react-router'
import Events from '../components/Events'
import Header from '../components/Header'

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <>
      <Header />
      <Events />
    </>
  )
}