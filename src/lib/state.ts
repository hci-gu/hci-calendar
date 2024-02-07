import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { dateToPosition, dateToWidth, positionToDates } from './utils'
import { v4 as uuid } from 'uuid'
import { Database } from '../../supabase/supabase'
import { EventAtom, updateType } from '../types/types'

const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
)
export default supabase
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

export const updateEvent = async (
    event: updateType,
    viewport: {
        width: number
        height: number
    }
) => {
    const dates = positionToDates(event.position.x, event.size.width, viewport)

    await supabase.from('events').upsert({
        id: event.id,
        start: dates.startDate,
        end: dates.endDate,
        y: event.position.y,
    })
}

export const eventsAtom = atom<EventAtom[]>([])
export const useEvents = () => {
    const viewport = useViewportSize()
    const [events, setEvents] = useAtom(eventsAtom)
    useEffect(() => {
        if (!viewport.width) return

        const run = async () => {
            const { data } = await supabase.from('events').select()

            if (!data) {
                return
            }

            setEvents(
                data.map((event) => ({
                    ...event,
                    position: dateToPosition(
                        event.start,
                        viewport.width,
                        event.y
                    ),

                    size: {
                        width: dateToWidth(
                            event.start,
                            event.end,
                            viewport.width
                        ),
                        height: 65,
                    },
                }))
            )
        }
        run()
    }, [viewport])

    return events ?? []
}

export const eventAtom = atomFamily((id: number) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
