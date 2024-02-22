import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect } from 'react'
import { EventType } from '../types/types'
import * as supabase from '../adapters/supabase'
import { sortEventsByFirstDeadlineTimestamp } from './utils'
import { getEvents } from '../adapters/pocketbase'

export const eventsAtom = atom<EventType[]>([])

export const useEvents = () => {
    const [events, setEvents] = useAtom(eventsAtom)

    useEffect(() => {
        const fetch = async () => {
            // const events = await supabase.getEvents()
            const events = await getEvents()
            console.log(events)

            const sortedEvents = sortEventsByFirstDeadlineTimestamp(events)
            setEvents(sortedEvents)
        }
        fetch()
    }, [])

    return events ?? []
}

export const eventAtom = atomFamily((id: string) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
