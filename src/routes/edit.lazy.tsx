import { createLazyFileRoute } from '@tanstack/react-router'
import Header from '../components/Header'
import Events from '../components/Events'
import AddEventButton from '../components/AddEventButton/AddEventButton'
import { TodayIndicator } from '../components/TodayIndicator'

export const Route = createLazyFileRoute('/edit')({
    component: Edit,
})

function Edit() {
    return (
        <>
            <Header />
            <Events />
            <TodayIndicator />
            <AddEventButton />
        </>
    )
}
