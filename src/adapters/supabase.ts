import { createClient } from '@supabase/supabase-js'
import { Database } from '../../supabase/supabase'
import { EventType, EventFromSupabaseType } from '../types/types'
import { EventFormType, EventTypeType } from '../types/zod'
import moment from 'moment'

const supabase = createClient<Database>(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_KEY
)

export const updateEvent = (event: EventType) =>
    supabase
        .from('newEvent')
        .update({
            title: event.title,
            type: event.type ?? undefined,
            deadlines: JSON.stringify(event.deadlines),
        })
        .eq('id', event.id)
        .select()
        .single()

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

export const getEvents = async (): Promise<EventType[]> => {
    const { data } = await supabase.from('newEvent').select()

    if (!data) return []

    return data.map(parseEvent)
}
