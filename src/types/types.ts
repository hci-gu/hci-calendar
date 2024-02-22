import { Database } from '@/supabase/supabase'
import { DeadlineFormType, EventTypeType } from './zod'

export type EventFromSupabaseType =
    Database['public']['Tables']['newEvent']['Row']

export type SizeType = {
    width: number
    height: number
}

export type PositionType = {
    x: number
    y: number
}

export type EventType = {
    id: number
    title: string
    type: EventTypeType
    deadlines: DeadlineFormType[]
}

/* https://stackoverflow.com/a/77346296 */
export type SetAtom<Args extends any[], Result> = (...args: Args) => Result
