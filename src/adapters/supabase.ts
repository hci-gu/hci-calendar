import { createClient } from '@supabase/supabase-js'
import { Database } from '../../supabase/supabase'
import { EventType, EventFromSupabaseType, EventTypeType } from '../types/types'
import { EventFormType } from '../types/zod'
import moment from 'moment'

const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
)

// TODO: acutally implement update
export const updateEvent = (event: EventType) =>
    supabase.from('newEvent').update({}).select().single()

export const createEvent = (formData: EventFormType) =>
    supabase
        .from('newEvent')
        .insert({
            title: formData.title,
            type: formData.type ?? '',
            deadlines: JSON.stringify(formData.deadlines),
        })
        .select()
        .single()

const parseEvent = (event: EventFromSupabaseType): EventType => {
    const deadlines = JSON.parse(event.deadlines as string).map(
        (deadline: any) => ({
            name: deadline.name,
            timestamp: new Date(deadline.timestamp ?? 0),
        })
    )

    return {
        id: event.id,
        title: event.title ,
        type: event.type as EventTypeType,
        deadlines,
    }
}

// export const getEvents = async (): Promise<EventType[]> => {
//     const { data } = await supabase.from('newEvent').select()

//     if (!data) return []

//     return data.map(parseEvent)
// }
export const getEvents = (): EventType[] => {
    const data: EventFromSupabaseType[] = [
        {
            id: 1,
            title: 'title',
            type: 'funding',
            deadlines: JSON.stringify([
                {
                    name: 'name',
                    timestamp: moment()
                        .startOf('month')
                        .add(2, 'months')
                        .toISOString(),
                },
            ]),
            created_at: moment().toISOString(),
        },
        {
            id: 2,
            title: 'title',
            type: 'funding',
            deadlines: JSON.stringify([
                {
                    name: 'name 1',
                    timestamp: moment()
                        .startOf('month')
                        .add(1, 'months')
                        .add(2, 'day')
                        .toISOString(),
                },
                {
                    name: 'name 2',
                    timestamp: moment()
                        .startOf('month')
                        .add(1, 'months')
                        .add(3, 'day')
                        .toISOString(),
                },
            ]),
            created_at: moment().toISOString(),
        },
        {
            id: 3,
            title: 'title #3',
            type: 'publication',
            deadlines: JSON.stringify([
                {
                    name: 'name 1',
                    timestamp: moment()
                        .startOf('month')
                        .add(5, 'months')
                        .toISOString(),
                },
                {
                    name: 'name 2',
                    timestamp: moment()
                        .startOf('month')
                        .add(6, 'months')
                        .add(1, 'day')
                        .toISOString(),
                },
                {
                    name: 'name 3',
                    timestamp: moment()
                        .startOf('month')
                        .add(8, 'months')
                        .add(1, 'day')
                        .toISOString(),
                },
            ]),
            created_at: moment().toISOString(),
        },
    ]

    return data.map(parseEvent)
}
