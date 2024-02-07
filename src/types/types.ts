import { Database } from "@/supabase/supabase";

export type EventType = Database['public']['Tables']['events']['Row']

export type sizeType = {
    width: number
    height: number
}

export type EventAtom = EventType & {
    position: { x: number; y: number }
    size: sizeType
}
export type updateType = {
    id: number
    position: { x: number; y: number }
    size: sizeType
}

/* https://stackoverflow.com/a/77346296 */
export type SetAtom<Args extends any[], Result> = (...args: Args) => Result;