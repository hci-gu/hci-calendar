import { atom, useAtom } from 'jotai'
import { atomFamily, loadable, unwrap } from 'jotai/utils'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { pixelToPosition, positionToPixel } from './utils'
import { v4 as uuid } from 'uuid'
const supabase = createClient('REPLACE ME WITH URL', 'REPLACE ME WITH KEY')

let id = 0
const userId = uuid()

const createEvent = () => ({
    id: id++,
    title: 'Testing',
    position: {
        x: Math.floor(Math.random() * 1000),
        y: 100 + Math.floor(Math.random() * 600),
    },
    size: {
        width: 100 + Math.floor(Math.random() * 100),
        height: 60 + Math.floor(Math.random() * 20),
    },
})

export const updateEvent = async (event, viewport) => {
    const position = pixelToPosition(event.position, viewport)
    await supabase.from('events').upsert({
        id: event.id,
        title: event.title,
        xPos: position.x,
        yPos: position.y,
        width: event.size.width,
        height: event.size.height,
        lastInteraction: userId,
    })
}

export const eventsAtom = atom([])
// export const eventsFetcherAtom = atom(async (get) => {
//     const { data } = await supabase.from('events').select()
//     return data.map((event) => ({
//         ...event,
//         position: {
//             x: event.xPos,
//             y: event.yPos,
//         },
//         size: {
//             width: event.width,
//             height: event.height,
//         },
//     }))
// })
// export const eventsAtom = unwrap(eventsFetcherAtom)
export const useEvents = () => {
    const viewport = useViewportSize()
    const [events, setEvents] = useAtom(eventsAtom)
    useEffect(() => {
        if (!viewport.width) return

        const run = async () => {
            const { data } = await supabase.from('events').select()

            setEvents(
                data.map((event) => ({
                    ...event,
                    position: positionToPixel(
                        { x: event.xPos, y: event.yPos },
                        viewport
                    ),
                    size: {
                        width: event.width,
                        height: event.height,
                    },
                }))
            )
        }
        run()
    }, [viewport])

    useEffect(() => {
        if (!viewport.width) return

        supabase
            .channel('events')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'events' },
                (payload) => {
                    const updatedEvent = payload.new
                    if (updateEvent.lastInteraction === userId) return
                    setEvents((events) =>
                        events.map((event) =>
                            event.id === updatedEvent.id
                                ? {
                                      ...event,
                                      position: positionToPixel(
                                          {
                                              x: updatedEvent.xPos,
                                              y: updatedEvent.yPos,
                                          },
                                          viewport
                                      ),
                                      size: {
                                          width: updatedEvent.width,
                                          height: updatedEvent.height,
                                      },
                                  }
                                : event
                        )
                    )
                }
            )
            .subscribe()
    }, [viewport])

    return events ?? []
}

export const eventAtom = atomFamily((id) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
