import { z } from 'zod'

export const deadlineSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    timestamp: z.date().nullable(),
})

const EventTypeType = z.enum(['funding', 'publication']).nullable()

export const formDataSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    type: EventTypeType.nullable(),
    deadlines: deadlineSchema
        .array()
        .min(1, { message: 'One deadline is required' }),
})

export type EventFormType = z.infer<typeof formDataSchema>
export type DeadlineFormType = z.infer<typeof deadlineSchema>
export type EventTypeType = z.infer<typeof EventTypeType>
