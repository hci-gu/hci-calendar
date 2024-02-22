import React from 'react'
import Header from './components/Header'
import Events from './components/Events'
import AddEventButton from './components/AddEventButton/AddEventButton'
import { TodayIndicator } from './components/TodayIndicator'

const App = () => {
    return (
        <>
            <Header />
            <TodayIndicator />
            <Events />
            <AddEventButton />
        </>
    )
}

export default App
