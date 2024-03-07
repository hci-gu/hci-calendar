import PocketBase from 'pocketbase'
import { EventType } from '../types/types'
import { EventFormType, formDataSchema } from '../types/zod'
import { z } from 'zod'
import moment from 'moment'

const pocketbase = new PocketBase(import.meta.env.VITE_POCKETBASE)

const parseEvent = (event: any): EventType => {
    const deadlines = event.deadlines.map((deadline: any) => {
        return {
            name: deadline.name,
            timestamp: moment(deadline.timestamp).toDate(),
            icon: deadline.icon,
        }
    })
    const body = {
        id: event.id,
        title: event.title,
        type: event.type,
        deadlines: deadlines,
    }

    const parsedEvent: EventType = formDataSchema
        .extend({ id: z.string() })
        .parse(body)

    return parsedEvent
}

export const getEvents = async (): Promise<EventType[]> => {
    pocketbase.autoCancellation(false)

    const records: any = await pocketbase.collection('events').getFullList({
        sort: '-created',
    })

    if (!records) {
        return []
    }
    return records.map((event: any) => parseEvent(event))
}

export const createEvent = async (FormData: EventFormType) => {
    const record = await pocketbase.collection('events').create(FormData)
    return record
}

export const updateEvent = async (event: EventType) =>
    await pocketbase.collection('events').update(event.id, event)

export const deleteEvent = async (event: EventType) =>
    await pocketbase.collection('events').delete(event.id)

type SubscribeCallback = (payload: { action: string; event: EventType }) => void
export const subscribe = (
    collection: string,
    event: string,
    callback: SubscribeCallback
) => {
    pocketbase.collection(collection).subscribe(event, (e: any) => {
        callback({
            action: e.action,
            event: parseEvent(e.record),
        })
    })

    return () => pocketbase.collection(collection).unsubscribe(event)
}
