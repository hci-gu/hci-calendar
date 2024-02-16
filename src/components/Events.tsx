import React from 'react'
import { Rnd } from 'react-rnd'
import { useEvents } from '../lib/state'
import EventCard from './EventCard'
import { positionAndWidthForDates } from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'

const Events = () => {
    const viewport = useViewportSize()
    const events = useEvents()

    return (
        <>
            {events.map((event, i) => {
                const [x, width] = positionAndWidthForDates(
                    event.deadlines.map((d) => d.timestamp),
                    viewport.width
                )

                const eventWidth = i !== 0 ? width : undefined
                
                return (
                    <Rnd
                        key={event.id}
                        position={{
                            x,
                            y: 100 + 160 * i,
                        }}
                        disableDragging
                        enableResizing={false}
                        minHeight={44}
                        bounds="window"
                    >
                        <EventCard event={event} width={eventWidth} />
                    </Rnd>
                )
            })}
        </>
    )
}

export default Events
