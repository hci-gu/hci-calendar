import { z } from 'zod'

export const deadlineSchema = z.object({
    name: z.string().min(1),
    timestamp: z.date().nullable(),
})

export const formDataSchema = z.object({
    title: z.string().min(3),
    type: z.enum(['🔴 funding', '🟢 publication']).nullable(),
    deadlines: deadlineSchema.array().min(1),
})

export type EventFormType = z.infer<typeof formDataSchema>
export type DeadlineFormType = z.infer<typeof deadlineSchema>
