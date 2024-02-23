import { DeadlineFormType, EventTypeType } from './zod'

export type SizeType = {
    width: number
    height: number
}

export type PositionType = {
    x: number
    y: number
}

export type EventType = {
    id: string
    title: string
    type: EventTypeType
    deadlines: DeadlineFormType[]
}

export type Row = {
    y: number
    eventsInRow: EventType[]
}
