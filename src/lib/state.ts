import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect } from 'react'
import { EventType } from '../types/types'
import * as supabase from '../adapters/supabase'

export const eventsAtom = atom<EventType[]>([])
export const useEvents = () => {
    const [events, setEvents] = useAtom(eventsAtom)

    useEffect(() => {
        const fetch = async () => {
            const events = await supabase.getEvents()
            setEvents(events)
        }
        fetch()
    }, [])

    return events ?? []
}

export const eventAtom = atomFamily((id: number) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
