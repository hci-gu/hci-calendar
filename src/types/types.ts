import { Database } from '@/supabase/supabase'

export type EventFromSupabaseType =
    Database['public']['Tables']['newEvent']['Row']

export type DeadlineType = {
    name: string
    timestamp: Date
}

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
    type: string
    deadlines: DeadlineType[]
}

const color = {
    'HCI-Red': 'HCI-Red',
    'HCI-Purple': 'HCI-Purple',
    'HCI-Blue': 'HCI-Blue',
    'HCI-Green': 'HCI-Green',
} as const

type ObjectValues<T> = T[keyof T]

export type colorType = ObjectValues<typeof color>

// export type EventUpdateBody = {
//     id: number
//     position: { x: number; y: number }
//     size: Size
// }

/* https://stackoverflow.com/a/77346296 */
export type SetAtom<Args extends any[], Result> = (...args: Args) => Result
