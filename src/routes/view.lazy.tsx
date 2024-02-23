import { createLazyFileRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import Events from '../components/Events'
import AddEventButton from '../components/AddEventButton/AddEventButton'

export const Route = createLazyFileRoute('/view')({
  component: About,
})

function About() {
  return (
    <>
      <Header />
      <Events />
      <AddEventButton />
    </>
  )
}