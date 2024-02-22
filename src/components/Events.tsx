import React from 'react'
import { Rnd } from 'react-rnd'
import EventCard from './EventCard'
import { positionAndWidthForDates, sortEventsIntoRows, getColor } from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { Divider, Flex, Stack, Text, Title } from '@mantine/core'
import moment from 'moment'

const Events = () => {
    const viewport = useViewportSize()
    const events = useEvents()
    const rows = sortEventsIntoRows({ events, viewportHeight: 2073 })

    return (
        <>
            {rows.map((row: Row, i) => {
                return row.eventsInRow.map((event: EventType) => {
                    const [x, width] = positionAndWidthForDates(
                        event.deadlines.map((d: DeadlineType) => d.timestamp),
                        viewport.width
                    )

                return (
                    <Rnd
                        key={event.id}
                        position={{
                            x,
                            y: 100 + 200 * i,
                        }}
                        disableDragging
                        enableResizing={false}
                        bounds="window"
                    >
                        <EventCard event={event} width={eventWidth} color={getColor(event.type)} />
                    </Rnd>
                )
            })}
        </>
    )
}

export default Events
