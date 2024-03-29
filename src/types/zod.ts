import { z } from 'zod'

export const IconType = z.enum(['Bell Icon', 'Paper Icon', 'User In Tie Icon'])

export const deadlineSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    timestamp: z.date(),
    icon: IconType,
})

export const EventTypeType = z.enum([
    'Funding',
    'Publication',
    'Conference',
    'Journal',
])

export const formDataSchema = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    type: EventTypeType,
    deadlines: deadlineSchema
        .array()
        .min(1, { message: 'One deadline is required' }),
})

export type EventFormType = z.infer<typeof formDataSchema>
export type DeadlineFormType = z.infer<typeof deadlineSchema>
export type EventTypeType = z.infer<typeof EventTypeType>
export type IconType = z.infer<typeof IconType>
