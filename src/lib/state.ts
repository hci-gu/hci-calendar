import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'
import { useViewportSize } from '@mantine/hooks'
import { positionAndWidthForDates } from './utils'
import { v4 as uuid } from 'uuid'
import { Database } from '../../supabase/supabase'
import { EventAtom, updateType } from '../types/types'
import { deadlinesZod } from '../types/zod'

const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
)
export default supabase
let id = 0

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
    // const dates = positionToDates(event.position.x, event.size.width, viewport)
    // await supabase.from('newEvent').upsert({
    //     id: event.id,
    //     start: dates.startDate,
    //     end: dates.endDate,
    //     y: event.position.y,
    // })
}

export const eventsAtom = atom<EventAtom[]>([])
export const useEvents = () => {
    const viewport = useViewportSize()
    const [events, setEvents] = useAtom(eventsAtom)
    useEffect(() => {
        if (!viewport.width) return

        const fetch = async () => {
            const { data } = await supabase.from('newEvent').select()
            // console.log(data)

            if (!data) {
                return
            }

            // data.map((event) => {
            //     console.log(typeof event.deadlines)
            // })
            let y = 0
            setEvents(
                data.map((event) => {
                    y += 100
                    const deadlines = deadlinesZod
                        .array()
                        .parse(JSON.parse(event.deadlines as string))

                    const dates = deadlines.map(
                        (deadline) => new Date(deadline.timestamp ?? 0)
                    )
                    const [x, width] = positionAndWidthForDates(
                        dates,
                        viewport.width
                    )

                    return {
                        ...event,
                        // Todo: Fix dateToPosition function
                        position: {
                            x,
                            y,
                        },
                        size: {
                            width,
                            height: 65,
                        },
                        deadlines,
                    }
                })
            )
        }
        fetch()
    }, [viewport])

    return events ?? []
}

export const eventAtom = atomFamily((id: number) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
