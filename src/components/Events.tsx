import React from 'react'
import { Rnd } from 'react-rnd'
import { useEvents } from '../lib/state'
import EventCard from './EventCard/index'

const Events = () => {
    const events = useEvents()

    return (
        <>
            {events.map((event) => (
                <Rnd
                    position={event.position}
                    size={event.size}
                    disableDragging
                    enableResizing={false}
                    minHeight={44}
                    bounds="window"
                >
                    <EventCard event={event} />
                </Rnd>
            ))}
        </>
    )
}

export default Events
