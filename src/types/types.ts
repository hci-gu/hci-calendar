import { Database } from "@/supabase/supabase";

export type EventType = Database['public']['Tables']['events']['Row']

export type EventAtom = EventType & {
    position: { x: number; y: number }
    size: { width: number; height: number }
}
export type updateType = {
    id: number
    position: { x: number; y: number }
    size: { width: number; height: number }
}