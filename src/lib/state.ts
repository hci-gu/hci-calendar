import { atom, useAtomValue, useSetAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect, useMemo } from 'react'
import { EventType } from '../types/types'
import { sortEventsByFirstDeadlineTimestamp } from './utils'
import * as pocketbase from '../adapters/pocketbase'

export const eventsAtom = atom<EventType[]>([])
export const initializeEventsAtom = atom(
    (get) => get(eventsAtom),
    (_, set, __) => {
        pocketbase.getEvents().then((events) => {
            set(eventsAtom, sortEventsByFirstDeadlineTimestamp(events))
        })

        pocketbase.subscribe('events', '*', (e) => {
            set(eventsAtom, (prevEvents) => {
                let newEvents = prevEvents
                switch (e.action) {
                    case 'create':
                        newEvents = [e.event, ...prevEvents]
                        break
                    case 'update':
                        newEvents = prevEvents.map((event) =>
                            event.id === e.event.id ? e.event : event
                        )
                        break
                    case 'delete':
                        newEvents = prevEvents.filter(
                            (event) => event.id !== e.event.id
                        )
                        break
                    default:
                }

                return sortEventsByFirstDeadlineTimestamp(newEvents)
            })
        })
    }
)

export const useEvents = () => {
    const events = useAtomValue(eventsAtom)
    const initializeEvents = useSetAtom(initializeEventsAtom)
    const memo = useMemo(() => ({ inited: false }), [])

    useEffect(() => {
        if (memo.inited) return
        memo.inited = true
        initializeEvents(null)
    }, [memo])

    return events ?? []
}

export const eventAtom = atomFamily((id: string) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
