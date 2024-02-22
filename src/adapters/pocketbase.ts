import PocketBase from 'pocketbase'
import { EventType } from '../types/types'
import { EventFormType } from '../types/zod'

const pocketbase = new PocketBase(process.env.VITE_POCKETBASE)

export const getEvents = async (): Promise<EventType[]> => {
    //@ts-ignore
    const { data }: { data: EventType[] } = await pocketbase
        .collection('events')
        .getFullList()

    if (!data) {
        return []
    }
    return data
}

export const createEvent = async (FormData: EventFormType) =>
    await pocketbase.collection('events').create(FormData)

export const updateEvent = async (event: EventType) =>
    //@ts-ignore
    await pocketbase.collection('events').update(event.id as string, event)
