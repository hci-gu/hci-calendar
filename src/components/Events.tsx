import { Rnd } from 'react-rnd'
import EventCard from './EventCard'
import {
    positionAndWidthForDates,
    sortEventsIntoRows,
    getColor,
} from '../lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { useEvents } from '../lib/state'
import { EventType, Row } from '../types/types'
import { DeadlineFormType } from '../types/zod'

const Events = () => {
    const viewport = useViewportSize()
    const events = useEvents()

    const rows = sortEventsIntoRows({ events, viewportHeight: 2073 })

    return (
        <>
            {rows.map((row: Row) => {
                return row.eventsInRow.map((event: EventType) => {
                    const [x, width] = positionAndWidthForDates(
                        event.deadlines.map(
                            (d: DeadlineFormType) => d.timestamp
                        ),
                        viewport.width
                    )

                    return (
                        <Rnd
                            style={{
                                zIndex: -events.indexOf(event),
                            }}
                            key={event.id}
                            position={{
                                x,
                                y: row.y,
                            }}
                            disableDragging
                            enableResizing={false}
                            bounds="window"
                        >
                            <EventCard
                                event={event}
                                width={width}
                                color={getColor(event.type)}
                            />
                        </Rnd>
                    )
                })
            })}
        </>
    )
}
export default Events
