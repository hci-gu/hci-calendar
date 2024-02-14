import React, { memo } from 'react'
import Header from './components/Header'
import { DraggableData, Rnd, RndDragEvent } from 'react-rnd'
import { useAtomValue, useSetAtom } from 'jotai'
import { eventAtom, eventsAtom, updateEvent, useEvents } from './lib/state'
import { gridSizeForWidth } from './lib/utils'
import { useViewportSize } from '@mantine/hooks'
import { useState } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { EventType, updateType } from './types/types'
import EventCard from './components/EventCard'
import { onDrag, onDragStart, onDragStop, onResize } from './lib/eventsEvent'

const compare = (objA: updateType | null, objB: updateType | null) => JSON.stringify(objA) === JSON.stringify(objB)

const Event = ({ id }: { id: number }) => {
    const setEvents = useSetAtom(eventsAtom)
    const [dragging, setIsDragging] = useState(false)
    const viewport = useViewportSize()
    const gridSize = gridSizeForWidth(viewport.width)

    const EventAtomValue = useAtomValue(eventAtom(id))

    if (!EventAtomValue) {
        return
    }
    const { size, position } = EventAtomValue

    const debounce = useMemo<{
        timeout: NodeJS.Timeout | null
        lastUpdate: updateType | null
    }>(
        () => ({
            timeout: null,
            lastUpdate: null,
        }),
        []
    )

    useEffect(() => {
        const update: updateType = {
            id,
            position,
            size,
        }
        if (debounce.timeout) {
            clearTimeout(debounce.timeout)
        }

        const newTimeout = setTimeout(() => {
            if (compare(debounce.lastUpdate, update)) {
                return
            }
            debounce.lastUpdate = update
            updateEvent(update, viewport)
        }, 500)

        debounce.timeout = newTimeout
        return () => clearTimeout(newTimeout)
    }, [dragging, viewport, size, position])


    return (
        <Rnd
            position={position}
            size={size}
            onDragStart={() => onDragStart(setIsDragging)}
            onDrag={(_event, dragg) => onDrag(dragg, size, id, setEvents)}
            onResize={(_event, _direction, ref) => onResize(ref, id, setEvents)}
            onDragStop={() => onDragStop(setIsDragging)}
            minHeight={44}
            bounds="window"
            dragGrid={[gridSize, gridSize]}
            resizeGrid={[gridSize, gridSize]}
        >
            <EventCard event={EventAtomValue} />
        </Rnd>
    )
}

const RenderEvents = ({ events }: { events: EventType[] }) => {
    return (
        <>
            {events.map((event) => (
                <Event key={event.id} id={event.id} />
            ))}
        </>
    )
}
const MemoizedRenderEvents = memo(RenderEvents, (prev, next) => {
    return prev.events.length === next.events.length
})

const Events = () => {
    const events = useEvents()

    return <MemoizedRenderEvents events={events ?? []} />
}

const App = () => {
    return (
        <div>
            <Header />
            <Events />
        </div>
    )
}

export default App
