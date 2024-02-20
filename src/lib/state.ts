import { atom, useAtom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { useEffect } from 'react'
import { EventType } from '../types/types'
import * as supabase from '../adapters/supabase'
import moment from 'moment'

export const eventsAtom = atom<EventType[]>([])

const sortEventsByFirstTimeDeadline = (events: EventType[]) => {
    return events.sort((a, b) => {
        const deadlineA = a.deadlines[0].timestamp.getTime()
        const deadlineB = b.deadlines[0].timestamp.getTime()
        return deadlineA - deadlineB
    })
}

const startOfEvent = (event: any) => event.deadlines[0].timestamp
const endOfEvent = (event: any) =>
    event.deadlines[event.deadlines.length - 1].timestamp
const isSameDay = (a: any, b: any) => {
    const dateA = moment(a)
    const dateB = moment(b)
    return (
        dateA.year == dateB.year &&
        dateA.month == dateB.month &&
        dateA.day == dateB.day
    )
}

const eventsOverlap = (eventA: any, eventB: any) => {
    const startA = moment(startOfEvent(eventA))
    const startB = moment(startOfEvent(eventB))
    const endA = moment(endOfEvent(eventA))
    const endB = moment(endOfEvent(eventB))

    return (
        (startB.isBefore(endA) && endB.isAfter(startA)) ||
        (isSameDay(endA, startB) && isSameDay(startA, startB))
    )
}

export const sortEventsIntoRows = ({
    events,
    veiwportHeight,
}: {
    events: EventType[]
    veiwportHeight: number
}) => {
    type Row = {
        y: number
        eventsInRow: EventType[]
    }

    let rows: Row[] = [
        {
            y: 100,
            eventsInRow: [],
        },
    ]
    const numberOfRows = (veiwportHeight - rows[0].y) / 200
    for (let i = 1; i < numberOfRows; i++) {
        rows.push({ y: rows[0].y + 200 * i, eventsInRow: [] })
    }
    if (events.length == 0) return rows

    rows[0].eventsInRow.push(events[0])
    let breakloop = false
    for (let i = 1; i < events.length; i++) {
        const event = events[i]
        console.log('checking for a space for event ' + event.id)

        for (let j = 0; j < rows.length; j++) {
            const row = rows[j]
            console.log('checking in row ' + j)
            if (row.eventsInRow.length == 0) {
                row.eventsInRow.push(event)
                console.log('event ' + event.id + ' found a spot in row ' + j)
                break
            }

            for (let k = 0; k < row.eventsInRow.length; k++) {
                const e = row.eventsInRow[k]
                if (
                    moment(event.deadlines[0].timestamp).isAfter(
                        moment(e.deadlines[e.deadlines.length - 1].timestamp)
                    )
                ) {
                    console.log(
                        'event ' + event.id + ' found a spot in row ' + j
                    )
                    row.eventsInRow.push(event)
                    breakloop = true
                    break
                }
            }

            // let canFit = false
            // for (let k = 0; k < row.eventsInRow.length; k++) {
            //     const e = row.eventsInRow[k]
            //     if (!eventsOverlap(e, event)) {
            //         canFit = true
            //     }
            // }

            // if (canFit) {
            //     row.eventsInRow.push(event)
            //     break
            // }
            if (breakloop) {
                break
            }
        }
    }
    // console.log(rows)
    return rows
}

export const useEvents = () => {
    const [events, setEvents] = useAtom(eventsAtom)

    useEffect(() => {
        const fetch = async () => {
            const events = await supabase.getEvents()
            const sortedEvents = sortEventsByFirstTimeDeadline(events)
            // console.log(sortedEvents.map((event) => {
            //     return event.deadlines[0].timestamp
            // }))

            // sortEventsIntoRows({
            //     events: sortedEvents,
            //     veiwportHeight: 2073,
            // })
            setEvents(sortedEvents)
        }
        fetch()
    }, [])

    return events ?? []
}

export const eventAtom = atomFamily((id: number) =>
    atom((get) => get(eventsAtom).find((event) => event.id === id))
)
