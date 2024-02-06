import React, { use } from 'react'
import Header from './components/Header'
import { Rnd } from 'react-rnd'
import { Card, Flex, Text } from '@mantine/core'
import { useAtomValue, useSetAtom } from 'jotai'
import { eventAtom, eventsAtom, updateEvent, useEvents } from './state'
import { dateToPosition, gridSizeForWidth, positionToDate } from './utils'
import { useViewportSize } from '@mantine/hooks'
import { useState } from 'react'
import { useCallback } from 'react'
import { useEffect } from 'react'
import { useMemo } from 'react'
import { Database } from '@/supabase/supabase'

type EventType = Database['public']['Tables']['events']['Row']

const compare = (objA: any, objB: any) =>
    JSON.stringify(objA) === JSON.stringify(objB)

type updateType = {
    id: number
    position: { x: number; y: number }
    size: { width: number; height: number }
}

const Event = ({ id }: { id: number }) => {
    const [dragging, setIsDragging] = useState(false)
    const viewport = useViewportSize()
    const gridSize = gridSizeForWidth(viewport.width)
    const setEvents = useSetAtom(eventsAtom)

    // const { title, size, position } = useAtomValue(eventAtom(id))
    const EventAtomValue = useAtomValue(eventAtom(id))

    if (!EventAtomValue) {
        return
    }
    const { title, start, y, size } = EventAtomValue
    const [position, setPositon] = useState<{ x: number; y: number }>(
        dateToPosition(start, viewport.width, y)
    )

    // setPositon(dateToPosition(start, viewport.width, y))
    // let size = { width: 100, height: 100 }

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
        // if (!dragging) return
        // console.log(position);

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
            onDragStart={() => {
                setIsDragging(true)
            }}
            onDrag={(e, d) => {
                setEvents((events) => {
                    const index = events.findIndex((ev) => ev.id === id)
                    const newEvents = [...events]
                    newEvents[index] = {
                        ...newEvents[index],
                        position: { x: d.x, y: d.y },
                        size,
                    }
                    return newEvents
                })
                setPositon({ x: d.x, y: d.y })
            }}
            onDragStop={() => {
                setIsDragging(false)
            }}
            onResize={(e, direction, ref, delta, position) => {
                setEvents((events) => {
                    const index = events.findIndex((ev) => ev.id === id)
                    const newEvents = [...events]
                    newEvents[index] = {
                        ...newEvents[index],
                        size: {
                            width: parseFloat(ref.style.width),
                            height: parseFloat(ref.style.height),
                        },
                    }
                    // size = {
                    //     width: parseFloat(ref.style.width),
                    //     height: parseFloat(ref.style.height),
                    // }
                    return newEvents
                })
            }}
            minHeight={44}
            bounds="window"
            dragGrid={[gridSize, gridSize]}
            resizeGrid={[gridSize, gridSize]}
        >
            <Card shadow="sm" withBorder style={{ height: '100%' }} radius="md">
                <Card.Section p={4} withBorder bg="orange">
                    <Flex justify="space-between">
                        <Text size="xs" fw="bold">
                            {positionToDate(position.x, viewport.width).format(
                                'MMM DD'
                            )}
                        </Text>
                        <Text size="xs" fw="bold">
                            {positionToDate(
                                position.x + size.width,
                                viewport.width
                            ).format('MMM DD')}
                        </Text>
                    </Flex>
                </Card.Section>
                <Card.Section p={8} withBorder bg="red">
                    <Text size="sm">{title}</Text>
                </Card.Section>
            </Card>
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
const MemoizedRenderEvents = React.memo(RenderEvents, (prev, next) => {
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
